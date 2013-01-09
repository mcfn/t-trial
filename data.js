
(function (exports) {

    Test.trial_datas = [
        
        // 每组数据用逗号（英文）分隔， 最后一组数据后不能接逗号
        
        
        {
            vline_length:100,
            hline_length:300,
            line_width:40,
            line_color:'yellow',
            rotationDeg: 90,
            mid_circle_show:'no', //no
            mid_circle_radius:10
        },

        {
            vline_length:200,
            hline_length:50,
            line_width:30,
            line_color:'blue',
            rotationDeg: 0,
            mid_circle_show:'yes', //no
            mid_circle_radius:10
        },

        {
            vline_length:100,
            hline_length:200,
            line_width:40,
            line_color:'green',
            rotationDeg: 180,
            mid_circle_show:'no', //no
            mid_circle_radius:10
        },
        {
            vline_length:200, // 垂直线长度（像素）
            hline_length:200, // 水平线长度（像素）
            line_width:40,    // 线条粗细（像素）
            line_color:'#ccc', // 颜色，可以是颜色名称：blue, green, red等；或者颜色数值: #ccc, #333333等
            rotationDeg: 270,  // 旋转角度
            mid_circle_show:'yes', // 是否显示中点：yes/no
            mid_circle_radius:10  // 空心圆半径
        },

        // 每组数据用逗号（英文）分隔， 最后一组数据后不能接逗号
    ];

})(typeof global === "undefined" ? window : exports);
    