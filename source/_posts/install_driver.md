---
title: 'NVIDIA驱动和CUDA安装脚本 for CentOS Stream 9'
date: '2025-12-21'
---

安装好centos9系统后，装好显卡，配置好网络环境。安装好NVIDIA驱动，然后安装CUDA工具包。以下是完整的安装脚本：

```bash
#!/bin/bash

# NVIDIA驱动和CUDA安装脚本 for CentOS Stream 9
# 作者: Assistant
# 说明: 此脚本用于在CentOS Stream 9上安装NVIDIA驱动和CUDA工具包

set -e  # 遇到错误立即退出

# ========== 配置部分 ==========
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color
readonly ORIG_TARGET=$(systemctl get-default)

readonly NVIDIA_DRIVER_URL="https://download.nvidia.com/XFree86/Linux-x86_64/580.105.08/NVIDIA-Linux-x86_64-580.105.08.run"
readonly NVIDIA_DRIVER_FILE="./NVIDIA-Linux-x86_64-580.105.08.run"
readonly CUDA_VERSION="12.4.0"
readonly CUDA_INSTALLER="cuda_${CUDA_VERSION}_550.54.14_linux.run"
readonly CUDA_URL="https://developer.download.nvidia.com/compute/cuda/${CUDA_VERSION}/local_installers/${CUDA_INSTALLER}"

# ========== 日志函数 ==========
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# ========== 工具函数 ==========
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "此脚本需要root权限运行"
        log_info "请使用: sudo bash $0"
        exit 1
    fi
}

check_nvidia_gpu() {
    log_step "1. 检查系统中是否存在NVIDIA GPU..."
    if lspci | grep -i nvidia > /dev/null 2>&1; then
        log_info "✓ 检测到NVIDIA GPU"
        return 0
    else
        log_error "✗ 未检测到NVIDIA GPU"
        return 1
    fi
}

# ========== 系统配置函数 ==========
update_system() {
    log_step "2. 正在更新系统..."
    dnf update -y
    log_info "✓ 系统更新完成"
}

configure_repos() {
    log_step "3. 配置软件仓库..."
    
    # 更新DNF缓存
    dnf makecache -y
    
    # 启用CRB仓库
    log_info "启用CRB仓库..."
    dnf config-manager --set-enabled crb
    
    # 安装EPEL仓库
    log_info "安装EPEL仓库..."
    dnf install -y epel-release epel-next-release
    
    # 再次更新缓存
    dnf makecache -y
    log_info "✓ 仓库配置完成"
}

install_dependencies() {
    log_step "4. 安装编译依赖..."
    
    # 获取内核版本
    KERNEL_VERSION=$(uname -r)
    log_info "当前内核版本: $KERNEL_VERSION"
    
    # 安装依赖包
    dnf install -y \
        kernel-headers-${KERNEL_VERSION} \
        kernel-devel-${KERNEL_VERSION} \
        tar \
        bzip2 \
        make \
        automake \
        gcc \
        gcc-c++ \
        pciutils \
        elfutils-libelf-devel \
        libglvnd-opengl \
        libglvnd-glx \
        libglvnd-devel \
        acpid \
        pkgconfig \
        dkms \
        wget
    
    log_info "✓ 依赖安装完成"
}

# ========== Nouveau驱动处理 ==========
disable_nouveau() {
    log_step "5. 禁用Nouveau驱动..."
    
    # 创建黑名单文件
    echo 'blacklist nouveau' > /etc/modprobe.d/blacklist-nouveau.conf
    echo 'options nouveau modeset=0' >> /etc/modprobe.d/blacklist-nouveau.conf
    
    # 备份原有initramfs
    local initramfs_file="/boot/initramfs-$(uname -r).img"
    if [ -f "$initramfs_file" ]; then
        cp "$initramfs_file" "${initramfs_file}.backup"
    fi
    
    # 更新initramfs
    dracut --force
    
    log_info "✓ Nouveau驱动已禁用"
}

verify_nouveau_disabled() {
    log_step "6. 验证Nouveau驱动状态..."
    if lsmod | grep nouveau > /dev/null 2>&1; then
        log_error "✗ Nouveau驱动仍在运行"
        return 1
    else
        log_info "✓ Nouveau驱动已成功禁用"
        return 0
    fi
}

# ========== 下载函数 ==========
download_file() {
    local url="$1"
    local filename="$2"
    local description="$3"
    
    if [ -f "$filename" ]; then
        log_info "✓ ${description}文件已存在: $filename"
        return 0
    fi
    
    log_info "正在下载${description}..."
    if wget -q --show-progress "$url" -O "$filename"; then
        log_info "✓ ${description}下载完成"
        return 0
    else
        log_error "✗ ${description}下载失败"
        log_info "请手动下载: $url"
        return 1
    fi
}

download_nvidia_driver() {
    log_step "7. 下载NVIDIA驱动..."
    download_file "$NVIDIA_DRIVER_URL" "$NVIDIA_DRIVER_FILE" "NVIDIA驱动"
}

download_cuda() {
    log_step "9. 下载CUDA工具包..."
    download_file "$CUDA_URL" "$CUDA_INSTALLER" "CUDA ${CUDA_VERSION}"
}

# ========== NVIDIA驱动安装 ==========
switch_to_text_mode() {
    log_info "切换到文本模式..."
    # systemctl set-default multi-user.target
    systemctl isolate multi-user.target
}

restore_target() {
  log_info "恢复默认启动目标: $ORIG_TARGET"
  systemctl set-default "$ORIG_TARGET"
}

install_nvidia_driver_silent() {
    log_info "尝试静默安装NVIDIA驱动..."
    
    if "$NVIDIA_DRIVER_FILE" \
        --silent \
        --no-nouveau-check \
        --no-x-check \
        --no-questions \
        --accept-license \
        --disable-nouveau \
        --install-libglvnd \
        --dkms; then
        log_info "✓ NVIDIA驱动安装成功（静默模式）"
        return 0
    fi
    return 1
}

install_nvidia_driver_interactive() {
    log_info "尝试交互模式安装NVIDIA驱动..."
    
    if "$NVIDIA_DRIVER_FILE" --no-x-check; then
        log_info "✓ NVIDIA驱动安装成功（交互模式）"
        return 0
    fi
    return 1
}

install_nvidia_driver() {
    log_step "8. 安装NVIDIA驱动..."
    
    # 检查驱动文件是否存在
    if [ ! -f "$NVIDIA_DRIVER_FILE" ]; then
        log_error "✗ 未找到NVIDIA驱动文件: $NVIDIA_DRIVER_FILE"
        return 1
    fi
    
    # 赋予执行权限
    chmod +x "$NVIDIA_DRIVER_FILE"
    
    # 切换到文本模式
    switch_to_text_mode
    
    # 安装驱动
    log_info "开始安装NVIDIA驱动..."
    log_info "安装过程可能需要几分钟，请耐心等待..."
    
    # 先尝试静默安装
    if install_nvidia_driver_silent; then
        return 0
    fi
    
    # 静默安装失败，尝试交互模式
    log_warn "静默安装失败，尝试交互模式安装..."
    if install_nvidia_driver_interactive; then
        return 0
    fi
    
    # 两种方式都失败
    log_error "✗ NVIDIA驱动安装完全失败"
    return 1
}

# ========== CUDA安装 ==========
install_cuda_toolkit() {
    log_step "10. 安装CUDA工具包..."
    
    # 检查CUDA安装文件
    if [ ! -f "$CUDA_INSTALLER" ]; then
        log_error "✗ 未找到CUDA安装文件: $CUDA_INSTALLER"
        return 1
    fi
    
    # 赋予执行权限
    chmod +x "$CUDA_INSTALLER"
    
    # 安装CUDA（不安装驱动）
    log_info "开始安装CUDA ${CUDA_VERSION}..."
    log_info "安装过程可能需要几分钟，请耐心等待..."
    
    # 创建安装日志
    local install_log="/tmp/cuda_install.log"
    
    if "./$CUDA_INSTALLER" \
        --silent \
        --toolkit \
        --override \
        --no-man-page \
        --no-opengl-libs \
        --installpath=/usr/local/cuda-${CUDA_VERSION} > "$install_log" 2>&1; then
        log_info "✓ CUDA安装成功"
        
        # 创建符号链接
        create_cuda_symlink
        return 0
    else
        log_error "✗ CUDA安装失败"
        log_info "安装日志: $install_log"
        return 1
    fi
}

create_cuda_symlink() {
    log_info "创建CUDA符号链接..."
    ln -sf /usr/local/cuda-${CUDA_VERSION} /usr/local/cuda
}

# ========== 环境配置 ==========
configure_environment() {
    log_step "11. 配置环境变量..."
    
    # 备份原有配置文件
    local bashrc_file="/etc/bashrc"
    if [ -f "$bashrc_file" ]; then
        cp "$bashrc_file" "${bashrc_file}.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # 添加CUDA环境变量
    cat >> "$bashrc_file" << 'EOF'

# CUDA Environment Variables
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
export CUDA_HOME=/usr/local/cuda
EOF
    
    log_info "✓ 环境变量已配置"
    log_info "请运行 'source /etc/bashrc' 或重新登录使配置生效"
}

# ========== 验证安装 ==========
verify_nvidia_driver() {
    log_step "12. 验证NVIDIA驱动安装..."
    
    if command -v nvidia-smi > /dev/null 2>&1; then
        log_info "✓ NVIDIA驱动安装成功"
        log_info "显示GPU信息:"
        nvidia-smi
        return 0
    else
        log_error "✗ NVIDIA驱动未正确安装"
        return 1
    fi
}

verify_cuda_installation() {
    log_step "13. 验证CUDA安装..."
    
    if [ -d "/usr/local/cuda" ]; then
        log_info "✓ CUDA目录存在: /usr/local/cuda"
        
        # 检查nvcc
        if [ -f "/usr/local/cuda/bin/nvcc" ]; then
            log_info "✓ nvcc编译器存在"
            log_info "CUDA版本:"
            /usr/local/cuda/bin/nvcc --version | grep release
            return 0
        else
            log_error "✗ nvcc编译器未找到"
            return 1
        fi
    else
        log_error "✗ CUDA目录不存在"
        return 1
    fi
}

# ========== 清理函数 ==========
cleanup_installation_files() {
    log_step "14. 清理安装文件..."
    
    local files_to_remove=(
        "$NVIDIA_DRIVER_FILE"
        "$CUDA_INSTALLER"
        "/tmp/cuda_install.log"
    )
    
    for file in "${files_to_remove[@]}"; do
        if [ -f "$file" ]; then
            rm -f "$file"
            log_info "已删除: $file"
        fi
    done
    
    log_info "✓ 清理完成"
}

# ========== 重启提示 ==========
show_reboot_prompt() {
    log_step "15. 安装完成！"
    
    echo "=========================================="
    echo "安装总结:"
    echo "------------------------------------------"
    
    if verify_nvidia_driver; then
        echo "✓ NVIDIA驱动: 已安装"
    else
        echo "✗ NVIDIA驱动: 安装失败"
    fi
    
    if verify_cuda_installation; then
        echo "✓ CUDA工具包: 已安装"
    else
        echo "✗ CUDA工具包: 安装失败"
    fi
    
    echo "------------------------------------------"
    log_warn "重要提示: 系统需要重启以完成安装"
    log_info "请执行以下命令重启系统:"
    echo "  sudo reboot"
    echo "=========================================="
}

# ========== 主安装流程 ==========
main_installation() {
    log_info "开始NVIDIA驱动和CUDA安装流程..."
    echo "=========================================="
    
    # 前置检查
    check_root
    if ! check_nvidia_gpu; then
        exit 1
    fi
    
    # 系统配置
    update_system
    configure_repos
    install_dependencies
    
    # Nouveau驱动处理
    disable_nouveau
    if ! verify_nouveau_disabled; then
        log_warn "Nouveau驱动可能仍在运行，建议重启后继续"
        read -p "是否继续安装？(y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # NVIDIA驱动安装
    if ! download_nvidia_driver; then
        exit 1
    fi
    
    if ! install_nvidia_driver; then
        exit 1
    fi
    
    # CUDA安装
    if ! download_cuda; then
        exit 1
    fi
    
    if ! install_cuda_toolkit; then
        exit 1
    fi
    
    # 后续配置
    configure_environment
    cleanup_installation_files
    
    # 验证和提示
    verify_nvidia_driver
    verify_cuda_installation
    show_reboot_prompt
    
    log_info "安装脚本执行完毕！"
}

# ========== 错误处理 ==========
handle_error() {
    local exit_code=$?
    log_error "脚本执行失败，退出码: $exit_code"
    log_info "请检查上述错误信息并解决问题后重试"
    exit $exit_code
}

# ========== 脚本入口 ==========
main() {
    # 设置错误处理
    trap 'handle_error' ERR
    
    # 显示欢迎信息
    echo "=========================================="
    echo "NVIDIA驱动和CUDA安装脚本"
    echo "适用于: CentOS Stream 9"
    echo "=========================================="
    echo "配置信息:"
    echo "  NVIDIA驱动版本: 580.105.08"
    echo "  CUDA版本: ${CUDA_VERSION}"
    echo "=========================================="
    
    # 确认继续
    read -p "是否继续安装？(y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "安装已取消"
        exit 0
    fi
    
    # 执行主安装流程
    main_installation
}

# 执行主函数
main "$@"
```