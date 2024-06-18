alias nano="micro"
alias python="python3"
alias pip="pip3"
alias zshconfig="mate ~/.zshrc"
alias ohmyzsh="mate ~/.oh-my-zsh"
alias ls="lsd -l"
alias ll="lsd -alh"
alias lsa="lsd -la"
alias gwipe="git reset --hard"
alias glist="git show --pretty="" --name-only"
alias cat="bat"
alias home="cd ~/"
alias z="zoxide query"
alias za="zoxide add"
alias ze="zoxide edit"
alias zh="zoxide --help"
alias sz="source ~/.zshrc"
alias sourcegit="source ~/.gitconfig"
alias ez="code ~/.zshrc"
alias editg="code ~/.gitconfig"
alias howdoi="howdoi -e duckduckgo $1"
alias cls="clear"
alias $="echo *** Remove leading $ character ***"
alias listalias="cat ~/.zshrc | grep alias"
alias catt="cat --style plain"
alias bc="better-commits"
alias lg="lazygit"
alias g="lazygit"
alias t="todo.sh"
alias w="watson"
alias cht="cht.sh"
alias nba="nb todo add $1"
alias nbl="nb list"
alias mc="LANG=en mc"
alias ppath="echo $PATH | tr ':' '\n'"
alias fzf="fzf -e -m --preview 'bat --color=always --style=numbers --line-range=:500 {}'"
alias zg="zgenom"
alias ya="yadm"
alias yas="yadm status"
alias yaa="yadm add"
alias yac="yadm commit"
alias yap="yadm push"
alias cm="chezmoi"
alias h="hoard"
alias hn="hoard new"
alias hl="hoard list"
alias hp="hoard pick"
alias hsync="chezmoi re-add ~/.config/hoard/trove.yml && chezmoi git commit && chezmoi git push"

# Zsh Navigation Tools
alias nc="n-cd"
alias na="n-aliases"
alias nh="n-history"
alias nk="n-kill"
alias ne="n-env"
alias no="n-options"
alias np="n-panelize"
alias nf="n-functions"

# Script aliases
alias printcommit="sh printFilesInCommit.sh"
alias copycommit="sh copyChangedFiles.sh"
alias copyback="sh copyFilesBack.sh"
alias gmove="sh moveCommit.sh"
alias cpDotFiles="sh copyDotFilesToGitRepo.sh"