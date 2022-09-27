/**
 * 获取配置项
 */
var config = null;

function initLoad() {
    config = FotoConfig;
}
function initData() {
    // 图片宽度默认值
    $("#imgWidth").val(config.imgWidth);
    $("#imgWidth").bind('input propertychange', function () {
        config.imgWidth = $("#imgWidth").val();
    })
    // 图片高度默认值
    $("#imgHeight").val(config.imgHeight);
    $("#imgHeight").bind('input propertychange', function () {
        config.imgHeight = $("#imgHeight").val();
    })

    // 图片列数默认值
    $("#img_column").val(config.imgColumn); // 图片列数
    // 图片列数实时预览
    $("#img_column").bind('input propertychange', function () {
        config.imgColumn = $("#img_column").val();
        /**
         * 动态设置宽度
         *  使用grid网格模型对布局进行动态更改
         */
        $("#bottom_imgList").css("grid-template-columns", "repeat(" + config.imgColumn + ", 1fr)");
        $("#bottom_center_imgList").css("grid-template-columns", "repeat(" + config.imgColumn + ", 1fr)");
        $("#bottom_right_imgList").css("grid-template-columns", "repeat(" + config.imgColumn + ", 1fr)");
    })

    $("#img_row").val(config.imgRow); // 图片行数
    // 图片行数实时预览
    $("#img_row").bind('input propertychange', function () {
        config.imgRow = $("#img_row").val();
        $("#bottom_imgList").css("grid-template-rows", "repeat(" + config.imgRow + ", 1fr)");
        $("#bottom_center_imgList").css("grid-template-rows", "repeat(" + config.imgRow + ", 1fr)");
        $("#bottom_right_imgList").css("grid-template-rows", "repeat(" + config.imgRow + ", 1fr)");
    })

    // 字号大小默认值
    $("#fontSize").val(config.imgFontSize);
    $("#fontSize").bind('input propertychange', function () {
        $(".img_item_input").each(function () {
            $(this).css("font-size", $("#fontSize").val() + "px")
        })
    })


    // 图片上是否展示文件名称
    $("#fileName").click(function () {
        var checkedStatus = document.getElementById("fileName").checked;
        if (checkedStatus) {
            config.imgIsShowFileName = 0;
            $(".img_item_input").each(function () {
                $(this).show();
            })
        } else {
            config.imgIsShowFileName = 1;
            $(".img_item_input").each(function () {
                $(this).hide();
            })
        }
    })
    // 每张图片的点击事件
    var mImgClick = document.getElementsByClassName("img_item_container");
    for (var i = 0; i < mImgClick.length; i++) {
        (function (i) {
            mImgClick[i].addEventListener('click', function () {
                alert(1)
            })
        })(i)
    }
    // 黑底白字点击事件
    $("#bw").click(function () {
        config.imgTitleStyle = 0;
        $(".img_item_input").each(function () {
            $(this).removeClass("white_black_text");
            $(this).addClass("black_white_text");
        })
    })
    // 白底黑字点击事件
    $("#wb").click(function () {
        config.imgTitleStyle = 1;
        $(".img_item_input").each(function () {
            $(this).removeClass("black_white_text");
            $(this).addClass("white_black_text");
        })
    })
    // 弹窗的相关事件 start
    $("#dialog_close").click(function () {
        $("#dialog_status").hide();
    }); // 弹窗关闭
    $("#dialog_cancel").click(function () {
        $("#dialog_status").hide();
    });
    // 点击确定获取输入框的值
    $("#dialog_confirm").click(function () {
        var vlaue = $("#update_img_title").val();
        if (!vlaue) {
            return toast("未作任何修改");
        }
        // 替换当前图片的名称
        $(".img_item_input").eq(config.changeImgTitleIndex).html(vlaue);
        // 同步修改模板数组里面的名称
        config.uploadImgList[config.changeImgTitleIndex] = $(".img").eq(config.changeImgTitleIndex).prop("src") + "${name}" + vlaue;
        $("#dialog_status").hide();
    })
    // 输入框回车事件
    //回车事件绑定
    $('#update_img_title').bind('keyup', function (event) {
        if (event.keyCode == "13") {
            //回车执行查询
            $('#dialog_confirm').click();
        }
    });

    // 弹窗的相关事件 end

    // 图片质量选中事件
    $("#img_quality").change(function () {
        config.scale = $(this).val();
    })
    // 是否保存为模板
    if (config.uploadImgList.length <= 0) {
        $("#template_n").attr("disabled", true);
        $("#template_y").attr("disabled", true);
    }
    $("#template_n").attr("checked", true);
    $(".template").each(function () {
        $(this).click(function () {
            var result = $(this).val();
            config.isTemplate = result;
            if (config.isTemplate == 1) {
                console.log("isTemp >>" + config.isTemplate);
                confirm("保存模板需要导出当前所有配置，点击取消将自动切换成不保存模板，点击确定将导出配置文件");
            }
        })
    })
    // 文件选择下拉框事件
    if (config.selectFileType == 0) {
        $("#files").attr("webkitdirectory", true);
    }
    $("#select_file").change(function () {
        config.selectFileType = $(this).val();
        if (config.selectFileType == 0) {
            $("#files").attr("webkitdirectory", true);
        } else {
            $("#files").removeAttr("webkitdirectory");
        }
    })
    // 生成图片命名赋值
    $("#img_called").val(config.imgCalled);
    $("#img_called").bind('input propertychange', function () {
        config.imgCalled = $(this).val();
    })
    // 页面刷新
    $("#refresh").click(function () {
        window.location.reload();
    })
    //点击导入按钮,使files触发点击事件,然后完成读取文件的操作
    $("#openFolder").click(function () {
        $("#files").click();
    })
}
function initListener() {
    // 导入模板配置文件
    $("#openTemplateConfig").click(function () {
        $("#templateConfig").click();
    })
    // 合成图片
    $("#startTransform").click(function () {
        if (config.uploadImgList.length <= 0) {
            return toast("请先上传图片");
        }
        hsycms.loading('图片生成中，请稍后');
        setTimeout(() => {
            var eleArr = [];
            // 克隆节点
            var clone_bottom_imgList = $("#bottom_imgList").clone(true);
            clone_bottom_imgList.attr("id", "clone_bottom_imgList");
            $("body").append(clone_bottom_imgList);
            $("#clone_bottom_imgList").css({ "position": "absolute", "top": "0px", "z-index": "-1" });
            $("#clone_bottom_imgList .img_item_container").css({ "width": config.imgWidth / 2, "height": config.imgHeight / 2 })
            // eleArr.push(clone_bottom_imgList)

            if ($("#bottom_center_imgList").children().length > 0) {
                var clone_bottom_center_imgList = $("#bottom_center_imgList").clone(true);
                clone_bottom_center_imgList.attr("id", "clone_bottom_center_imgList");
                $("body").append(clone_bottom_center_imgList);
                $("#clone_bottom_center_imgList").css({ "position": "absolute", "top": "0px", "z-index": "-1" });
                $("#clone_bottom_center_imgList .img_item_container").css({ "width": config.imgWidth / 2, "height": config.imgHeight / 2 })
            }

            if ($("#bottom_right_imgList").children().length > 0) {
                var clone_bottom_right_imgList = $("#bottom_right_imgList").clone(true);
                clone_bottom_right_imgList.attr("id", "clone_bottom_right_imgList");
                $("body").append(clone_bottom_right_imgList);
                $("#clone_bottom_right_imgList").css({ "position": "absolute", "top": "0px", "z-index": "-1" });
                $("#clone_bottom_right_imgList .img_item_container").css({ "width": config.imgWidth / 2, "height": config.imgHeight / 2 })
            }

            if ($("#clone_bottom_imgList").length > 0 || $("#clone_bottom_center_imgList").length > 0 || $("#clone_bottom_right_imgList").length > 0) {
                // debugger
                eleArr.push(clone_bottom_imgList);
                if ($("#bottom_center_imgList").children().length > 0) {
                    eleArr.push(clone_bottom_center_imgList);
                }
                if ($("#bottom_right_imgList").children().length > 0) {
                    eleArr.push(clone_bottom_right_imgList);
                }
                for (var i = 0; i < eleArr.length; i++) {
                    (function (i) {
                        var item = eleArr[i];
                        html2canvas(item[0], { scale: config.scale, width: (config.imgColumn * config.imgWidth) / 2, height: (config.imgRow * config.imgHeight) / 2 })
                            .then(canvas => {
                                var imgData = canvas.toDataURL("image/jpeg");
                                // console.log(imgData);
                                // document.body.appendChild(canvas)
                                // 图片保存
                                canvas.toBlob(function (blob) {
                                    saveAs(blob, config.imgCalled + (i + 1) + ".png");
                                });
                            });
                    })(i)
                }
                // 保存图片数据
                // console.log("imgList >>" + config.uploadImgList);
                // if (config.isTemplate == 1) {
                //     console.log("config isTemp >>" + config.isTemplate)
                //     exportRaw('Template_' + config.imgRow + '_' + config.imgColumn + '.txt', config.uploadImgList);
                // }
                //销毁克隆对象
                $("#clone_bottom_imgList").empty().remove();
                $("#clone_bottom_center_imgList").empty().remove();
                $("#clone_bottom_right_imgList").empty().remove();
            }
            hsycms.closeAll();
        }, 1500);
    })
}
/**
 * 导入图片事件
 */
function fileImport() {
    //获取读取我文件的File对象
    let instances = []; // 文件实例数组
    var selectedFile = document.getElementById('files').files;
    console.log("多文件上传的 >>" + $("#files").val())
    for (var i = 0; i < selectedFile.length; i++) {
        (function (i) {
            var item = selectedFile[i];
            var resArr = null;
            var name = item.name.split(".")[0]; //读取选中文件的文件名 不携带后缀名
            var size = item.size; //读取选中文件的大小
            // console.log("文件名:" + name + "大小:" + size);
            var reader = new FileReader(); //这是核心,读取操作就是由它完成.
            reader.readAsDataURL(item); //读取文件的内容,也可以读取文件的URL
            reader.onload = function (e) {
                // //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
                // console.log("wwwww >>" + e.target.result);
                // image = e.target.result;

                // instances[i] = image;
                // $("#imgList").append('<img class="img" src="'+ instances[i] +'">');
                // console.log(instances);
                if (i == 0) {
                    // console.log("开始读取")
                    hsycms.loading('文件读取中');
                }

                const image = new Image();
                image.src = e.target.result; // 获取图片文件的base64数据
                // console.log(e.target.result)
                // 解决跨域
                // image.setAttribute('crossOrigin', 'anonymous');   
                // image.src = e.target.result + '?time=' + new Date().valueOf();
                image.onload = () => {
                    if (i == selectedFile.length - 1) {
                        hsycms.closeAll();
                    }
                    // 加载成功后禁用列数行数
                    $("#img_column").attr("disabled", true);
                    $("#img_row").attr("disabled", true);
                    // 图片实例化成功后存起来
                    instances[i] = image;

                    if (config.isUploadTemplate) {
                        // 如果当前导入了模板，那么uploadImgList会被清空掉，也就是数组的长度直接从0开始了，为了防止这个，需要添加个状态进行判断
                        config.uploadImgList[config.finishedNum] = instances[i].src + "${name}" + name;
                    } else {
                        config.uploadImgList[i] = instances[i].src + "${name}" + name;
                    }

                    // console.log("instances", instances[0].src);
                    config.finishedNum++;
                    // 放开模板选择的禁用
                    $("#template_n").removeAttr("disabled");
                    $("#template_y").removeAttr("disabled");
                    // console.log("fins >>" + config.finishedNum)
                    /**
                     * 三个区域对应的数据
                     *     根据 config.finishedNum 进行判断，防止用户上传的图片是分多次上传的，如果用 i 进行判断就会出现第二次上传后，i的值会从0进行计算
                     *     每个区域存放的数据就根据默认设置的列数和行数进行展示，
                     */
                    var totalShowImgSize = config.imgColumn * config.imgRow;
                    var finishedNum = config.finishedNum - 1;
                    var node = '<div class="img_item_container" title="长按进行拖拽" onclick="preview()" ondblclick="changeImg(' + finishedNum + ')" + data-id="' + finishedNum + '" ><img class="img" src="' + instances[i].src + '"><div class="img_item_input black_white_text" onclick="updateImgTitle(\'' + name + '\',' + finishedNum + ',event)">' + name + '</div></div>';
                    if (finishedNum <= totalShowImgSize - 1) {
                        $("#bottom_imgList").append(node);
                        dragSort("bottom_imgList");
                    } else if (finishedNum >= totalShowImgSize - 1 && finishedNum <= totalShowImgSize * 2 - 1 && config.finishedNum > totalShowImgSize) {
                        $("#bottom_center_imgList").append(node);
                        dragSort("bottom_center_imgList");
                    } else if (finishedNum >= totalShowImgSize * 2 - 1 && finishedNum <= totalShowImgSize * 3 - 1) {
                        // console.log("right >>" + i);
                        $("#bottom_right_imgList").append(node);
                        dragSort("bottom_right_imgList");
                    }
                    console.log("导入模板 >>" + config.uploadImgList.length);
                }
            }
        })(i)
    }
}
/**
 * 修改图片名称
 * @param {*} text 
 */
function updateImgTitle(text, index, event) {
    // 阻止事件冒泡
    event.stopPropagation();
    config.changeImgTitleIndex = index;
    // $("#update_img_title").val("");
    $("#dialog_status").css("display", "flex");
    $("#dialog_title").html("当前图片位置：" + (index + 1));
    $("#update_img_title").focus();
    $("#imgView").attr("src", $(".img").eq(index).prop("src"));
}
/**
 * 预览图片
 */
function preview() {
    //取消上次延时未执行的方法
    clearTimeout(config.timer);
    //设置延时300ms
    config.timer = setTimeout(function () {
        //在此写单击事件要执行的代码
        // alert("图片预览的逻辑")
    }, 300);
}
/**替换图片
 * 当前图片的索引
 * @param {*} index 
 */
function changeImg(index) {
    //取消上次延时未执行的方法
    clearTimeout(config.timer);
    //下面写双击事件要执行的代码
    // 唤起文件上传弹窗
    $("#updateFiles").click();
    changeImgIndex = index;
    console.log("changeImgIndex >>" + changeImgIndex)
}
/**
 * 修改图片的监听事件
 */
function updateFileImport() {
    var File = document.getElementById('updateFiles').files;
    console.log("type >>" + File[0].name)
    var item = File[0];
    var name = item.name.split(".")[0]; //读取选中文件的文件名 不携带后缀名
    var reader = new FileReader(); //这是核心,读取操作就是由它完成.
    reader.readAsDataURL(item); //读取文件的内容,也可以读取文件的URL
    reader.onload = function (e) {
        const image = new Image();
        image.src = e.target.result; // 获取图片文件的base64数据
        var sFlag = null;
        for (var i = 0; i < config.finishedNum; i++) {
            (function (i) {
                var item = $(".img").eq(i).prop("src");
                if (item == image.src) {
                    sFlag = false;
                    return sFlag;
                }
            })(i)
        }
        if (sFlag == false) {
            return toast("~亲，图片已存在啦~");
        }
        image.onload = function () {
            /**
             * 替换当前图片的src和name
             */
            $(".img").eq(changeImgIndex).attr("src", image.src);
            // 替换图片的文件名
            $(".img_item_input").eq(changeImgIndex).html(name);
            // 同步修改模板数组里面的图片路径和图片名称
            config.uploadImgList[changeImgIndex] = image.src + "${name}" + name;
        }
    }
    // Tip：防止第二次上传相同文件后没有反应的问题
    $("#updateFiles").val('');
}

/**
 * 导入模板配置文件
 */
function importTemplateConfig() {
    hsycms.loading('模板导入中');
    var configFiles = document.getElementById('templateConfig').files;
    var item = configFiles[0];
    //var name = item.name.split(".")[0]; //读取选中文件的文件名 不携带后缀名
    var reader = new FileReader(); //这是核心,读取操作就是由它完成.
    reader.readAsText(item); //读取文件的内容,也可以读取文件的URL
    console.log("item", item);
    reader.onload = function (e) {
        // 加载成功后禁用列数行数
        $("#img_column").attr("disabled", true);
        $("#img_row").attr("disabled", true);
        // 放开模板禁用
        $("#template_n").removeAttr("disabled");
        $("#template_y").removeAttr("disabled");
        config.isUploadTemplate = true;
        var result = JSON.parse(e.target.result);
        // 重置配置项目
        resetConfig(result, function () {
            var imageList = result.uploadImgList;
            for (var i = 0; i < imageList.length; i++) {
                (function (i) {
                    config.finishedNum++;
                    var totalShowImgSize = config.imgColumn * config.imgRow;
                    var finishedNum = config.finishedNum - 1;
                    var item = imageList[i];
                    var src = item.split("${name}")[0];
                    var name = item.split("${name}")[1];
                    var node = '<div class="img_item_container" title="长按进行拖拽" onclick="preview()" ondblclick="changeImg(' + finishedNum + ')"><img data-id="' + finishedNum + '" class="img" src="' + src + '"><div class="img_item_input black_white_text" onclick="updateImgTitle(\'' + name + '\',' + finishedNum + ',event)">' + name + '</div></div>';
                    if (finishedNum <= totalShowImgSize - 1) {
                        $("#bottom_imgList").append(node);
                        dragSort("bottom_imgList");
                    } else if (finishedNum >= totalShowImgSize - 1 && finishedNum <= totalShowImgSize * 2 - 1 && config.finishedNum > totalShowImgSize) {
                        $("#bottom_center_imgList").append(node);
                        dragSort("bottom_center_imgList");
                    } else if (finishedNum >= totalShowImgSize * 2 - 1 && finishedNum <= totalShowImgSize * 3 - 1) {
                        // console.log("right >>" + i);
                        $("#bottom_right_imgList").append(node);
                        dragSort("bottom_right_imgList");
                    }
                    if (i == imageList.length - 1) {
                        hsycms.closeAll();
                    }
                })(i)
            }
            console.log("result >>", result)
        })

    }
}
/**
 * 重置配置文件
 * @param {*} result 
 */
function resetConfig(result, finish) {
    // 给uploadImgList添加数据，用于导出模板使用
    config.uploadImgList = result.uploadImgList;

    // 图片宽度
    config.imgWidth = Number(result.imgWidth);
    $("#imgWidth").val(config.imgWidth);
    // 图片高度
    config.imgHeight = Number(result.imgHeight);
    $("#imgHeight").val(config.imgHeight);
    // 图片列数
    config.imgColumn = Number(result.imgColumn);
    $("#img_column").val(config.imgColumn);
    // 图片行数
    config.imgRow = Number(result.imgRow);
    $("#img_row").val(config.imgRow);
    // 图片质量
    config.scale = Number(result.scale);
    $("#img_quality option").eq(config.scale - 1).attr("selected", true);

    // 动态设置布局
    $("#bottom_imgList").css("grid-template-columns", "repeat(" + config.imgColumn + ", 1fr)");
    $("#bottom_center_imgList").css("grid-template-columns", "repeat(" + config.imgColumn + ", 1fr)");
    $("#bottom_right_imgList").css("grid-template-columns", "repeat(" + config.imgColumn + ", 1fr)");

    if (finish) {
        finish();
        // 标题样式
        config.imgTitleStyle = Number(result.imgTitleStyle);
        $(':radio[name="titleStyle"]').eq(config.imgTitleStyle).click();
        // 是否显示文件名称
        config.imgIsShowFileName = Number(result.imgIsShowFileName);
        if (config.imgIsShowFileName == 1) {
            $("#fileName").click();
            // 隐藏文件名称
            $(".img_item_input").each(function () {
                $(this).hide();
            })
        } else {
            $(".img_item_input").each(function () {
                $(this).show();
            })
        }
        // 字号大小
        config.imgFontSize = Number(result.imgFontSize);
        $("#fontSize").val(config.imgFontSize);

        // finished
        // config.finishedNum = result.finishedNum;
    }
}
/**
 * 拖拽排序
 * @param {*} element 
 */
function dragSort(element) {
    //获取对象
    var el = document.getElementById(element);
    //设置配置
    var ops = {
        animation: 1000,
        dataIdAttr: "data-id",
        //delay: 500,  // 延时时间，默认长按1s后可以拖动
        //拖动结束
        onEnd: function (evt) {
            // console.log(evt);
            //获取拖动后的排序
            var arr = sortable.toArray();
            // config.uploadImgList
            var newUploadImglist = []; // 存放拖拽后的图片数据
            for (var i = 0; i < arr.length; i++) {
                (function (i) {
                    newUploadImglist.push(config.uploadImgList[arr[i]]);
                })(i)
            }
            // 覆盖原数组
            config.uploadImgList = newUploadImglist;
            // debugger
            console.log(JSON.stringify(arr));
        },
    };
    //初始化
    var sortable = Sortable.create(el, ops);
}

// 保存txt文档start
function fakeClick(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    obj.dispatchEvent(ev);
}

function exportRaw(name, data, finish) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fakeClick(save_link);
    if (finish) {
        finish();
    }
}
// 保存txt文档end


//提示弹窗
function toast(txt) {
    hsycms.tips(txt, () => {
        // console.log("提示关闭后");
    }, 1500)
}
// 询问弹窗
function modal(txt) {
    hsycms.alert(txt, () => {
        console.log("关闭后");
    })
}
//取消确认弹窗
function confirm(text) {
    hsycms.confirm(text,
        function (res) {
            hsycms.success('模板已生成');
            // 导出配置文件
            exportRaw("config.txt", JSON.stringify(config), function () {
                // 重置成不保存选项，否则在转换图片的时候会再次下载配置文件
                $("#template_n").click();              
            })

        },
        function (res) {
            hsycms.closeAll();
            // 切换成不保存选项
            $("#template_n").click();
        },
    )
}
// 失败弹窗
function dialogFail(text) {
    hsycms.fail(text, () => { console.log('操作失败关闭后'); }, 2000)
}

window.onload = function () {
    // 初始化配置信息
    initLoad();
    // 初始化数据
    initData();
    // 初始化事件
    initListener();
}
