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

# Apply Chezmoi configuration
echo "Applying Chezmoi configuration..."
chezmoi init

# Decrypt the Age key
echo "Decrypting Age key..."
source decrypt-age-key.sh

# Now that the Age key is decrypted, re-apply Chezmoi configuration to use the decrypted key
echo "Re-applying Chezmoi configuration with decrypted Age key..."
chezmoi apply