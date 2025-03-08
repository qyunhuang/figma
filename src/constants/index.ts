// 当前环境模式
export const ENV_MODE = import.meta.env.MODE

// 接口的网关域名
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 主题管理
export const APP_DEFAULT_THEME = import.meta.env.VITE_APP_DEFAULT_THEME

// 产品名称
export const APP_NAME = import.meta.env.VITE_APP_NAME

// 网站首页标题
export const APP_TITLE = import.meta.env.VITE_APP_TITLE

// 网站描述
export const APP_DESC = import.meta.env.VITE_APP_DESC

// 网站描述
export const APP_KEYWORDS = import.meta.env.VITE_APP_KEYWORDS

// 本地存储前缀
export const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX

export const fontWeightOptions = [
  { label: 'Regular', value: '400' },
  { label: 'Semibold', value: '500' },
  { label: 'Bold', value: '600' },
]

export const fontSizeOptions = [
  {
    value: "10",
    label: "10",
  },
  {
    value: "12",
    label: "12",
  },
  {
    value: "14",
    label: "14",
  },
  {
    value: "16",
    label: "16",
  },
  {
    value: "18",
    label: "18",
  },
  {
    value: "20",
    label: "20",
  },
  {
    value: "22",
    label: "22",
  },
  {
    value: "24",
    label: "24",
  },
  {
    value: "26",
    label: "26",
  },
  {
    value: "28",
    label: "28",
  },
  {
    value: "30",
    label: "30",
  },
  {
    value: "32",
    label: "32",
  },
  {
    value: "34",
    label: "34",
  },
  {
    value: "36",
    label: "36",
  },
]

export const exportOptions = [
  { label: "PNG", value: "png" },
  { label: "JPEG", value: "jpeg" },
  { label: "SVG", value: "svg" },
  { label: "PDF", value: "pdf" },
]