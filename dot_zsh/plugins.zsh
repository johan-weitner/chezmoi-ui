# z.lua
# eval "$(lua $(brew --prefix z.lua)/share/z.lua/z.lua --init zsh)"

#Zoxide
eval "$(zoxide init zsh)"

# Load Direnv
eval "$(direnv hook zsh)"

# # Hishtory Config:
# export PATH="$PATH:$HOME/.hishtory"
# source $HOME/.hishtory/config.zsh

# Autojump
 [ -f $HOMEBREW_PREFIX/etc/profile.d/autojump.sh ] && . $HOMEBREW_PREFIX/etc/profile.d/autojump.sh
