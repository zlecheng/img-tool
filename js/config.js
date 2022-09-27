
var FotoConfig = {
    // 文件选择类型
    selectFileType: 0,
    // 当前是否上传了模板
    isUploadTemplate: false,
    // 本次上传的所有图片
    uploadImgList: [],
    // 单机事件和双击事件共存,用于图片的预览和更换当前图片
    timer: null,
    // 更换图片标题的索引
    changeImgTitleIndex: null,
    // 更换图片的索引
    changeImgIndex: null,
    // 上传图片个数
    finishedNum: 0,
    // 图片宽度
    imgWidth: 500,
    // 图片高度
    imgHeight: 500,
    // 默认列数
    imgColumn: 3,
    // 默认行数
    imgRow: 5,
    // 布局方向
    imgDirection: 1,
    // 标题样式
    imgTitleStyle: 0,
    // 是否显示文件名称
    imgIsShowFileName: 0,
    // 字号大小
    imgFontSize: 16,
    // 描边大小
    imgOutline: 1,
    // scale：html2Canvas 导出图片清晰度，默认为 1
    scale: 2,
    // 生成后图片的命名
    imgCalled: "img",
    // 是否保存为模板
    isTemplate: 0
}