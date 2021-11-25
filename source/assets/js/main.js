$(document).ready(function () {
    clickTreeDirectory();
    focus()
    goTop()
    directoryIndex()
});

function clickTreeDirectory() {
    $(document).on('click', '#categories .category-item .category-name', function (e) {
        let icon = $(this).children(".icon-plus")
        let subCat = $(this).parent().next(".sub-cat")
        // 判断子分类是否展开
        if (icon.hasClass("open")) {
            icon.removeClass("open")
            subCat.slideUp({ duration: 200 });
        } else {
            icon.addClass("open")
            subCat.slideDown({ duration: 200 });
        }
    })
}

function focus() {
    $(".search .search-input").bind("focus", function (e) {
        const _input = $(".search .search-input")
        getSearch(_input)
    })
}

function getSearch(_input) {
    $.ajax({
        url: "/search.json",
        dataType: 'json',
        success: function (res) {
            _input.bind("input propertychange", function (e) {
                searcher(res, e.currentTarget.value);
            })
        }
    })
}


// 匹配规则: 如果有多个关键词, 用空格隔开, 必须同时含有输入的关键词的文章才能被匹配
function searcher(data, _input) {

    let keywords = _input.trim().toLowerCase()

    if (keywords.length <= 0) {
        $('#search-page .search-list').removeClass('show').addClass('none')
        $('#body').show()
        return
    }

    _search = $('#search-page .search-list')
    _search.empty()
    let temp = 0
    let keywords_list = keywords.split(/\s+/)
    keywords_list = uniqueArr(keywords_list)
    let keywords_match = keywords_list.join('|')

    data.forEach((item) => {
        let title = item.title
        let match_result = title.match(new RegExp(keywords_match, 'ig')) //匹配标题
        match_result = uniqueArr(match_result)
        //标题有匹配到,且关键词数组和匹配结果必须相等, 这里用数组长度来判断(不够严谨)
        if (match_result && match_result.length === keywords_list.length) {
            temp++
            $('#body').css({ display: 'none' })
            _search.removeClass('none').addClass('show')
            // 匹配标题, 替换关键字
            title = title.replace(new RegExp(keywords_match, 'ig'), `<strong>$&</strong>`)
            title = strUpperCase(labelUpperCase(title))
            let content = matchContent(item.content, keywords)
            // 获取时间
            let time = getTime(item.url)
            const html = renderHtml(title, content, item.url, time)
            _search.prepend(html)
        } else {
            $('#body').css({ display: 'none' })
            _search.removeClass('none').addClass('show')
            // 标题中不含关键字, 查看内容中是否含有关键字
            let content_text = item.content.replace(/<[^>]+>/gi, "");
            let match_result = content_text.match(new RegExp(keywords_match, 'ig')) //匹配内容
            if (!match_result) return // 标题和内容都没有匹配到
            match_result = uniqueArr(match_result)
            if (match_result.length !== keywords_list.length) return
            temp++
            let index = content_text.search(new RegExp(keywords_match, 'ig')) // 关键字第一次出现的位置
            // 匹配内容
            let content = wordsContext(content_text, keywords_match, index)
            let title = strUpperCase(item.title)
            // 获取时间
            let time = getTime(item.url)
            html = renderHtml(title, content, item.url, time)
            _search.prepend(html)
        }
    });

    if (temp === 0) {
        // 没有搜到文章
        let none = `
            <div class="text-center py-5 my-5">
                <p style="font-size:2rem">Sorry!<p>
                <p class="text-gray"> 
                    没有你要找的内容。 
                </p>
            </div>
        `
        _search.prepend(none)
    }

}

// 匹配内容
function matchContent(data, keywords) {
    let content_text = data.replace(/<[^>]+>/gi, ""); // 剥离HTML标签
    let index = content_text.search(new RegExp(keywords, 'i'))
    if (index >= 0) {
        return wordsContext(content_text, keywords, index)
    } else {
        // 没有匹配到截取内容开头部分
        return content = content_text.substr(0, 120)
    }
}

// 检查内容是否含有关键字
function checkWords(data, keywords) {
    let content_text = data.replace(/<[^>]+>/gi, ""); // 剥离HTML标签
    return content_text.search(new RegExp(keywords, 'i'))
}

/**
 * 截取关键字所在上下文
 * @param {string} data 被截取的字符串
 * @param {string} keywords 关键字
 * @param {int} index 关键字所在位置的索引
 * @returns 
 */
function wordsContext(data, keywords, index) {
    let slice_length = 120 // 截取长度
    let start = index - slice_length / 2 // 开始截取位置
    let end = index + slice_length / 2 // 结束位置
    if (start < 0) {
        start = 0
        end = slice_length
    }
    let content_slice = data.slice(start, end) // 截取内容
    return content_slice.replace(new RegExp(keywords, 'ig'), `<strong>$&</strong>`)

}

// 标签在第一位的首字母转换成大写
function labelUpperCase(str) {
    let label = '<strong>'
    if (str.indexOf(label) === 0) {
        subStr = str.substr(label.length)
        str = label + subStr.charAt(0).toUpperCase() + subStr.slice(1)
    }
    return str
}

// 首字母大写
function strUpperCase(str) {
    var arr = str.split('');
    for (let i = 0, len = arr.length; i < len; i++) {
        if (i === 0) {
            arr[i] = arr[i].toUpperCase()
        } else {
            if (arr[i - 1].search(/[\s-|\u4e00-\u9fa5]+/g) != -1) {
                arr[i] = arr[i].toUpperCase()
            }
        }
    }
    var str1 = arr.join("");
    return str1;
}

// 获取时间
function getTime(data) {
    return data.substr(1, 11).replace(/\//g, '-')
}

// 数组去重
function uniqueArr(arr) {
    if (!arr) return
    return arr.filter(function (element, index, self) {
        return self.indexOf(element.toLowerCase()) === index
    })
}

/**
 * 输出一段html字符串
 * @param {String} title 标题
 * @param {String} content 内容
 * @param {String} url 地址
 * @param {String} time 时间
 * @returns 
 */
function renderHtml(title, content, url, time) {

    const html = `
        <div class="post-list">
            <h1><a class="title" style="font-family: monospace;" href="${url}"> ${title} </a></h1>      
            <a class="text-none" href="${url}">
                <div class="post my-3">
                    ${content}
                    <span class="font-sm">  ...<span>       
                </div>
            </a>
            <div class="font-sm mb-5">
                ${time}
            </div>
        </div>`

    return html
}

function directoryIndex() {
    if($("#article").length==0) return
    if ($('#dir').length) tocbot.destroy();
    tocbot.init({
        tocSelector: '#dir',
        contentSelector: '#article',
        headingSelector: 'h1, h2, h3',
        scrollSmooth: true,
        hasInnerContainers: true,
        orderedList: false,
    });
}

// 监听屏幕滚动
$(window).on("scroll", function (e) {
    scrollPage()
});

function scrollPage() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        $('#up-top').css({
            opacity: 1,
            bottom: '0.8rem',
        })
    } else {
        $('#up-top').css({
            opacity: 0,
            bottom: '-3rem',
        })
    }
}

function goTop() {
    $('#up-top').on('click', function () {
        $("body, html").animate(
            { 'scrollTop': document.body.scrollTop = 0 },
            500
        );
    })

}