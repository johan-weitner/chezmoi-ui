#!/bin/bash
echo ""
echo "Starting clean install..."
#chezmoi init https://$PRIVATE_GITHUB_TOKEN@github.com/johan-weitner/dotfiles.git
# sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply $GITHUB_USERNAME
export PATH="$HOME/bin:$PATH"

sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply https://$PRIVATE_GITHUB_TOKEN@github.com/johan-weitner/dotfiles.git