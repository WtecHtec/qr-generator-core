// 二维码配置类型
export interface QRConfig {
    content: string;
    size: number;
    position: Position;
    margin: number;
    // 使用 qr-code-styling 的配置选项
    dotsOptions: {
        color: string;
        type: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
        gradient?: {
            type: 'linear' | 'radial';
            rotation: number;
            colorStops: any;
        };
    };
    backgroundOptions: {
        color: string;
        gradient?: {
            type: 'linear' | 'radial';
            rotation: number;
            colorStops: any;
        };
    };
    cornersSquareOptions: {
        color: string;
        type: 'square' | 'extra-rounded' | 'dot';
        gradient?: {
            type: 'linear' | 'radial';
            rotation: number;
            colorStops: any;
        };
    };
    cornersDotOptions: {
        color: string;
        type: 'square' | 'dot';
        gradient?: {
            type: 'linear' | 'radial';
            rotation: number;
            colorStops: any;
        };
    };
    imageOptions?: {
        hideBackgroundDots: boolean;
        imageSize: number;
        margin: number;
        crossOrigin: string;
    };
    qrOptions: {
        typeNumber: number;
        mode: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji';
        errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    };
    logo?: {
        src: string;
        size: number;
    };
}

// 位置配置
export interface Position {
    x: number;
    y: number;
}

// 尺寸配置
export interface Size {
    width: number;
    height: number;
}

// 背景图片配置
export interface BackgroundImage {
    id: string;
    src: string;
    position: Position;
    size: Size;
    mode: 'fill' | 'contain';
    zIndex: number;
    opacity: number;
}

// 文案配置
export interface TextLayer {
    id: string;
    content: string;
    position: Position;
    fontSize: number;
    color: string;
    fontFamily: string;
    fontWeight: number;
    zIndex: number;
    opacity: number;
}

// HTML模块配置
export interface HtmlModule {
    id: string;
    content: string;
    position: Position;
    size: Size;
    zIndex: number;
    opacity: number;
}

// 导出配置
export interface ExportConfig {
    width: number;
    height: number;
    format: 'png' | 'jpg';
    quality: number;
    borderRadius: number, // 默认无圆角
}

// 画布配置
export interface CanvasConfig {
    qr: QRConfig;
    backgrounds: BackgroundImage[];
    texts: TextLayer[];
    htmlModules: HtmlModule[];
    export: ExportConfig;
}