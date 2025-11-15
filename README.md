# Documentation Technique - CV Numérique Auto-hébergé

## Vue d'ensemble du projet

Création et déploiement d'un CV numérique interactif hébergé sur un serveur personnel Ubuntu, accessible publiquement via un nom de domaine Freebox, avec une architecture sécurisée basée sur Docker et NGINX.

---

## Architecture technique

### Infrastructure

| Composant | Technologie |
|-----------|-------------|
| **Système d'exploitation** | Ubuntu 24.04 LTS |
| **Serveur web** | NGINX 1.24.0 |
| **Conteneurisation** | Docker + Docker Compose |
| **Réseau** | Freebox (mode routeur) |
| **Nom de domaine** | portfolio06.freeboxos.fr |
| **Port d'exposition** | 16789 |

### Stack technologique

- **Frontend** : HTML5, CSS3, JavaScript vanilla
- **Design** : Interface responsive avec animations CSS
- **Structure** : Site statique monopage
- **Serveur** : NGINX via conteneur Docker

---

## Mise en place de l'infrastructure

### 1. Configuration Docker

**Fichier `docker-compose.yml`** :
- version: '3'
- services:
- web:
- image: nginx:latest
- ports:
- "16789:80"
- volumes:
- ./html:/usr/share/nginx/html
- restart: unless-stopped


**Commandes de déploiement** :

Lancement du conteneur

sudo docker compose up -d
Vérification de l'état

sudo docker ps
Arrêt et relance

sudo docker compose down
sudo docker compose up -d


### 2. Configuration réseau Freebox

**Redirection de port** :

| Paramètre | Valeur |
|-----------|--------|
| Port externe | 16789 (TCP) |
| IP destination | 192.168.1.88 |
| Port destination | 80 |
| Protocole | TCP |
| Statut | Actif |

**Nom de domaine personnalisé** :
- Domaine : `portfolio06.freeboxos.fr`
- Certificat TLS/RSA : ✅ Valide
- Mode réseau : Routeur

### 3. Configuration NGINX (reverse proxy)

**Fichier `/etc/nginx/sites-available/portfolio06`** :

server {
listen 80;
server_name portfolio06.freeboxos.fr;

# Désactivation des ETags
etag off;

# En-têtes de sécurité HTTP
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;

location / {
    proxy_pass http://localhost:16789;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}



**Activation** :

sudo ln -s /etc/nginx/sites-available/portfolio06 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl daemon-reload
sudo systemctl reload nginx


---

## 🔒 Sécurisation du serveur

### Mesures de sécurité implémentées

#### En-têtes de sécurité HTTP

| En-tête | Valeur | Protection |
|---------|--------|------------|
| `X-Frame-Options` | SAMEORIGIN | Anti-clickjacking |
| `X-Content-Type-Options` | nosniff | Anti-MIME sniffing |
| `X-XSS-Protection` | 1; mode=block | Anti-XSS |
| `Referrer-Policy` | no-referrer-when-downgrade | Contrôle des referrers |

#### Isolation par conteneurisation

- ✅ Utilisation de Docker pour isolation applicative
- ✅ Limitation des privilèges du conteneur
- ✅ Séparation des volumes et réseaux
- ✅ Redémarrage automatique (`restart: unless-stopped`)

#### Configuration réseau sécurisée

- ✅ Port non standard (16789) pour réduire les scans automatiques
- ✅ NAT via Freebox comme première couche de filtrage
- ✅ Pas d'exposition directe des ports 80/443

### Outils de sécurité installés

#### Outils de scan et d'audit

**1. Nikto** - Scanner de vulnérabilités web

nikto -h http://portfolio06.freeboxos.fr:16789


**Résultats** :
- ✅ En-têtes de sécurité présents
- ✅ Pas de vulnérabilités critiques
- ⚠️ ETags détectés (corrigé ensuite)

**2. Lynis** - Audit de sécurité système

sudo lynis audit system


**Résultats** :
- Score de durcissement : **59/100**
- Status : Correct pour un serveur personnel
- Recommandations : Appliquées

**3. nmap** - Scanner de ports réseau

sudo nmap -sS -p- portfolio06.freeboxos.fr


#### Outils de protection recommandés

**fail2ban** - Protection contre les attaques par force brute

sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban


**rkhunter** - Détection de rootkits

sudo apt install rkhunter -y
sudo rkhunter --update
sudo rkhunter --check


**auditd** - Journalisation avancée

sudo apt install auditd -y
sudo systemctl enable auditd
sudo systemctl start auditd


---

## ⚡ Script de déploiement automatisé

**Fichier `deploy.sh`** :

#!/bin/bash
Configuration

NEW_PORT=16789
COMPOSE_FILE="docker-compose.yml"

echo "---- Mise à jour du port Docker ----"
sed -i -E "s/"[0-9]+:80"/"$NEW_PORT:80"/" "$COMPOSE_FILE"

echo "---- Arrêt des anciens conteneurs ----"
sudo docker compose down

echo "---- Démarrage des conteneurs ----"
sudo docker compose up -d

echo "---- État des conteneurs ----"
sudo docker ps

echo ""
echo "Site accessible : http://portfolio06.freeboxos.fr:$NEW_PORT/"


**Utilisation** :

- chmod +x deploy.sh 
- ./deploy.sh


---

## ✅ Tests et validation

### Tests de sécurité effectués

1. **Scan web avec Nikto**
   - ✅ En-têtes de sécurité présents
   - ✅ Pas de vulnérabilités critiques
   - ✅ ETags désactivés

2. **Audit système avec Lynis**
   - ✅ Score : 59/100
   - ✅ Recommandations appliquées
   - ✅ Packages à jour

3. **Tests de connectivité**
   - ✅ Accès local fonctionnel
   - ✅ Accès externe fonctionnel
   - ✅ Résolution DNS correcte

### Commandes de vérification

Vérifier les ports en écoute

sudo ss -tuln | grep :80
sudo ss -tuln | grep :16789
Vérifier l'état Docker

sudo docker ps
Tester l'accès local

curl -I http://localhost:16789
Vérifier les logs NGINX

sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log


---

## 🔧 Maintenance

### Commandes essentielles

Mise à jour du système

sudo apt update && sudo apt upgrade -y
Relancer le conteneur

sudo docker compose down
sudo docker compose up -d
Logs du conteneur

sudo docker logs mon-cv-site-web-1
Sauvegarde

tar -czf backup-cv-$(date +%Y%m%d).tar.gz html/


### Monitoring recommandé

- [ ] Vérifier régulièrement les logs NGINX
- [ ] Lancer Lynis une fois par mois
- [ ] Mettre à jour les images Docker
- [ ] Surveiller l'espace disque

---

## 🌐 Accès

| Type | URL/IP |
|------|--------|
| **URL publique** | http://portfolio06.freeboxos.fr:16789 |
| **IP publique** | 88.126.209.94 |
| **IP locale** | 192.168.1.88 |
| **Mapping ports** | 16789 (externe) → 80 (interne) |

---

## 💡 Compétences démontrées

### Administration système Linux
- ✅ Installation et configuration Ubuntu Server
- ✅ Gestion des services systemd
- ✅ Configuration réseau et pare-feu
- ✅ Audit de sécurité

### Conteneurisation Docker
- ✅ Création de docker-compose.yml
- ✅ Gestion des volumes et ports
- ✅ Orchestration de conteneurs
- ✅ Bonnes pratiques de sécurité

### Configuration serveur web
- ✅ Installation et configuration NGINX
- ✅ Reverse proxy
- ✅ En-têtes HTTP de sécurité
- ✅ Gestion des sites virtuels

### Sécurité informatique
- ✅ En-têtes de sécurité HTTP
- ✅ Scan de vulnérabilités
- ✅ Audit système
- ✅ Protection contre attaques web

### Réseau et infrastructure
- ✅ Configuration NAT
- ✅ Redirection de ports
- ✅ Gestion DNS
- ✅ Architecture client-serveur

### Automatisation
- ✅ Scripts Bash
- ✅ Déploiement automatisé
- ✅ Gestion de configuration

---

## 🎯 Points d'amélioration

### Court terme
- [ ] Ajouter HTTPS avec Let's Encrypt
- [ ] Installer fail2ban
- [ ] Configurer démarrage automatique

### Moyen terme
- [ ] Système de backup automatique
- [ ] Monitoring Prometheus/Grafana
- [ ] WAF (ModSecurity)
- [ ] Logs centralisés

### Long terme
- [ ] Migration vers VPS dédié
- [ ] Mise en place d'un CDN
- [ ] CI/CD avec GitHub Actions
- [ ] Load balancing

---

## 📊 Conclusion

Ce projet démontre la mise en place complète d'une infrastructure web sécurisée auto-hébergée, depuis la conteneurisation jusqu'à la configuration réseau et la sécurisation. L'architecture combine **simplicité**, **sécurité** et **bonnes pratiques DevOps**.

**Date** : Novembre 2025  
**Auteur** : Matthieu Calesse  
**Formation** : BUT Informatique - IUT de Lille

---

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Documentation NGINX](https://nginx.org/en/docs/)
- [Guide de sécurité Lynis](https://cisofy.com/lynis/)
- [OWASP Security Headers](https://owasp.org/www-project-secure-headers/)
