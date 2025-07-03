# Use Node.js 20 slim as base image for better security
FROM node:20-bookworm-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    zsh \
    curl \
    wget \
    sudo \
    ca-certificates \
    gnupg \
    jq \
    ripgrep \
    fd-find \
    bat \
    exa \
    htop \
    tree \
    vim \
    nano \
    unzip \
    && rm -rf /var/lib/apt/lists/*


# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && sudo apt update \
    && sudo apt install gh -y

# Install pnpm globally
RUN npm install -g pnpm@10.10.0

# Install Claude Code globally
RUN npm install -g @anthropic-ai/claude-code

# Set up non-root user
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Configure the node user
RUN groupmod --gid $USER_GID $USERNAME \
    && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
    && chown -R $USER_UID:$USER_GID /home/$USERNAME

# Add node user to sudoers
RUN echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Install oh-my-zsh and powerline10k for the node user
USER $USERNAME
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k

# Set zsh as default shell and configure powerline10k
RUN echo 'ZSH_THEME="powerlevel10k/powerlevel10k"' >> ~/.zshrc \
    && echo 'POWERLEVEL9K_DISABLE_CONFIGURATION_WIZARD=true' >> ~/.zshrc \
    && echo 'POWERLEVEL9K_INSTANT_PROMPT=quiet' >> ~/.zshrc

# Configure bash history persistence
RUN echo 'PROMPT_COMMAND="history -a; history -c; history -r; $PROMPT_COMMAND"' >> ~/.bashrc

# Switch back to root for final setup
USER root

# Set up workspace directory
RUN mkdir -p /workspaces/xj-mono
WORKDIR /workspaces/xj-mono


# Switch to node user for development
USER $USERNAME

# Set environment variables
ENV SHELL=/usr/bin/zsh
ENV PNPM_HOME="/home/node/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Switch back to root to create directories with proper permissions
USER root

# Create common directories that might be needed
RUN mkdir -p /workspaces/xj-mono/node_modules \
    /workspaces/xj-mono/web/node_modules \
    /workspaces/xj-mono/packages/db/node_modules \
    && chown -R node:node /workspaces/xj-mono

# Switch back to node user
USER $USERNAME