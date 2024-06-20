#!/bin/bash

# Path to the encrypted Age key in Chezmoi data directory
ENCRYPTED_KEY_PATH="$HOME/.local/share/chezmoi/dot_config/vault/encrypted_key.age.age"

# Path to store the decrypted Age key temporarily
DECRYPTED_KEY_PATH="$HOME/.config/vault/key.age"

# Ensure the temporary decrypted key file doesn't already exist
if [ -f "$DECRYPTED_KEY_PATH" ]; then
    echo "Error: Decrypted key file already exists at $DECRYPTED_KEY_PATH"
    exit 1
fi

# Decrypt the Age key using Age
echo "Decrypting Age key..."
age --decrypt --identity /path/to/your/identity/file "$ENCRYPTED_KEY_PATH" > "$DECRYPTED_KEY_PATH"

echo "Age key decrypted and stored at $DECRYPTED_KEY_PATH"