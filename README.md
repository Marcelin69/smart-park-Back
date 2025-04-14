# 📦 Guide de Prise en Main du Projet Node.js

## 📜 Introduction
Ce guide vous explique comment cloner, installer et démarrer un projet Node.js à partir d'un dépôt Git. Il est destiné aux développeurs qui souhaitent contribuer ou utiliser le projet pour la première fois.

## 🔍 Prérequis
- **Node.js** : Assurez-vous d'avoir Node.js installé sur votre machine. Vous pouvez le télécharger depuis [nodejs.org](https://nodejs.org/).
- **Git** : Installez Git pour cloner le dépôt. Vous pouvez le télécharger depuis [git-scm.com](https://git-scm.com/).

## 🛠️ Étapes de Mise en Place

### 1. Cloner le Dépôt
- **Commande** :
  ```bash
  git clone https://github.com/
  ```
- **Description** : Remplacez l'URL par celle de votre dépôt Git. Cette commande téléchargera une copie locale du projet sur votre machine.

### 2. Accéder au Répertoire du Projet
- **Commande** :
  ```bash
  cd votre-depot
  ```
- **Description** : Naviguez dans le répertoire du projet que vous venez de cloner.

### 3. Installer les Dépendances
- **Commande** :
  ```bash
  npm install
  ```
- **Description** : Cette commande installe toutes les dépendances nécessaires listées dans le fichier `package.json`.

### 4. Configurer les Variables d'Environnement
- **Description** : Si le projet utilise des variables d'environnement, créez un fichier `.env` à la racine du projet et définissez les variables nécessaires.
- **Exemple de `.env`** :
  ```
  port="3001"
  host="0.0.0.0"
  baseUrl='http://0.0.0.0:3001'
  SECRETE_KET='123456789marcelino'
  NODE_ENV=test
  ```

### 5. Démarrer le Serveur
- **Commande** :
  ```bash
  nodemon index.js
  ```
- **Description** : Démarre le serveur Node.js. Assurez-vous que le script `start` est défini dans le fichier `package.json`.

### 6. Exécuter les Tests
- **Commande** :
  ```bash
  npx jest --runInBand
  ```
- **Description** : Exécute les tests unitaires pour vérifier que tout fonctionne correctement. Assurez-vous que le script `test` est défini dans le fichier `package.json`.

