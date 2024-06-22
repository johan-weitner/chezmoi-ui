#!/bin/bash

# Ensure Homebrew is installed
if ! command -v brew &> /dev/null; then
  echo "Homebrew is not installed. Installing..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Ensure Chezmoi is installed
if ! command -v chezmoi &> /dev/null; then
    echo "Chezmoi is not installed. Installing..."
    brew install chezmoi
fi

# Decrypt the Age key
# echo "Decrypting Age key..."
# source decrypt-age-key.sh

# Apply Chezmoi configuration
# echo "Applying Chezmoi configuration..."
# chezmoi init

# # Now that the Age key is decrypted, re-apply Chezmoi configuration to use the decrypted key
# echo "Re-applying Chezmoi configuration with decrypted Age key..."
# chezmoi apply

sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply https://$GITHUB_TOKEN@github.com/johan-weitner/dotfiles.git



###############

sudo apt update

sudo apt install git nano

echo | /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

(echo; echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"') >> /home/johanweitner/.bashrc

eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"

brew install chezmoi
brew install gomplate
brew install volta
brew install wget
brew install zx
brew install 1password-cli

# 1Password-CLI
# sudo -s \
# curl -sS https://downloads.1password.com/linux/keys/1password.asc | \
# gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg
# echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/$(dpkg --print-architecture) stable main" |
# tee /etc/apt/sources.list.d/1password.list
# mkdir -p /etc/debsig/policies/AC2D62742012EA22/
# curl -sS https://downloads.1password.com/linux/debian/debsig/1password.pol | \
# tee /etc/debsig/policies/AC2D62742012EA22/1password.pol
# mkdir -p /usr/share/debsig/keyrings/AC2D62742012EA22
# curl -sS https://downloads.1password.com/linux/keys/1password.asc | \
# gpg --dearmor --output /usr/share/debsig/keyrings/AC2D62742012EA22/debsig.gpg
# apt update && apt install 1password-cli

sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply https://$GITHUB_TOKEN@github.com/johan-weitner/dotfiles.git