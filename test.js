﻿
(function (exports) {

    ////////////////////////////
    // Common
    ////////////////////////////
    var Test = function () {
        
        this.TRIALS_SIZE = 10; // 每次测试trial的数量
        this.isRandomTrial = true; // true表示随机选取trial测试，false表示不随机，顺序选取
        this.TRIAL_STEP_1_WAIT_TIME = 5000; // 单位ms，step 1 '+'的等待时间
        this.TRIAL_STEP_2_WAIT_TIME = 500; // 单位ms,  step 2 空白时间
        this.TRIAL_STEP_3_WAIT_TIME = 5000; // 单位ms, step 3, trial图形显示的等待时间
        this.TRIAL_STEP_4_WAIT_TIME = 5000; // 单位ms, step 4, '#'的等待时间 

        this.TRIAL_STEP_1 = 0; // show +
        this.TRIAL_STEP_2 = 1; // show blank
        this.TRIAL_STEP_3 = 2; // show T
        this.TRIAL_STEP_4 = 3; // show # 



        this.cur_trial_step = 0;
        this.trial_set = []; // 选中的待测试trial集合
        this.cur_trial_idx = 0; // 当前第几个trial


        // draw
        this.stage;
        this.layer;
        this.STAGE_WIDTH = 800;
        this.STAGE_HEIGHT = 800;

        this.end_stage;
        this.end_layer;

        this.wait_time = null;
    };

    // 初始化trial数据
    Test.prototype.init = function (nums) {

        $('#start').show();
        $('#trial').hide();
        $('#result').hide();

        if ( nums != null )
        this.TRIALS_SIZE = nums;
        // 随机生成trial数据
        this.trial_set = this.getTrialSet();
        this.cur_trial_idx = -1;

        // draw
        this.stage = new Kinetic.Stage({
            container: 'container',
            width: this.STAGE_WIDTH,
            height: this.STAGE_HEIGHT
        });

        this.layer = new Kinetic.Layer();

        for (var idx=0;idx<this.trial_set.length;idx++) {
            var cur_trial = this.trial_set[idx];

            var a = ( cur_trial.vline_length )/2,
                b = ( cur_trial.hline_length ) / 2,
                c = Math.sqrt(a*a+b*b),
                init_angle = Math.atan(a/b) * 180 / Math.PI,
                tmp_angle = (cur_trial.rotationDeg + init_angle) % 360;
                tmp_x = c * Math.cos( (tmp_angle%180) *Math.PI/180  ), 
                tmp_y = c * Math.sin( (tmp_angle%180) *Math.PI/180  ),
                x = this.STAGE_WIDTH/2 ,
                y = this.STAGE_HEIGHT/2;
            
            // 修正坐标值
            if ( tmp_angle >= 0 && tmp_angle <180 ) {
                x = x - tmp_x; 
                y = y - tmp_y;
            } else if ( tmp_angle >= 180 && tmp_angle < 360) {
                x = x + tmp_x; 
                y = y + tmp_y;
            }
            


            var group = new Kinetic.Group({
                x: x ,
                y: y ,
                rotationDeg: cur_trial.rotationDeg,
                width: cur_trial.hline_length,
                height: cur_trial.vline_length,
                id: idx,
                visible: false
            });

            // 竖线
            var rectV = new Kinetic.Rect({
                x: cur_trial.hline_length/2 - cur_trial.line_width/2,
                y: 0,
                width: cur_trial.line_width,
                height: cur_trial.vline_length,
                fill: cur_trial.line_color
            });
            group.add(rectV);

            // 横线
            var rectH = new Kinetic.Rect({
                x: 0,
                y: cur_trial.vline_length - cur_trial.line_width,
                width: cur_trial.hline_length,
                height: cur_trial.line_width,
                fill: cur_trial.line_color
            });
            group.add(rectH);

            // 中心圆
            if ( cur_trial.mid_circle_show == 'yes' ) {
                var circle = new Kinetic.Circle({
                    x: cur_trial.hline_length / 2 ,
                    y: cur_trial.vline_length/2 ,
                    radius: cur_trial.mid_circle_radius,
                    fill: 'white'
                });
                group.add(circle);
            }

            this.layer.add(group);
        }
        // add the layer to the stage
        this.stage.add(this.layer);

        this.drawTrialEndPic();

    }

    Test.prototype.drawTrialEndPic = function() {
        // draw
        this.end_stage = new Kinetic.Stage({
            container: 'end_container',
            width: this.STAGE_WIDTH,
            height: this.STAGE_HEIGHT
        });

        var line_width = 20, line_height = 180,
            line_gap = 30, x = 180, y = 50;

        this.end_layer = new Kinetic.Layer();

            var group = new Kinetic.Group({
                x: x ,
                y: y ,
                id: 'end_trial',
                visible: true
            });
        for ( var i=0;i<3;i++) {

            // 竖线
            var rectV = new Kinetic.Rect({
                x: x + line_gap + i*(line_width + line_gap),
                y: y,
                width: line_width,
                height: line_height,
                fill: 'black'
            });
            group.add(rectV);

            // 横线
            var rectH = new Kinetic.Rect({
                x: x,
                y: y + line_gap + i*(line_width + line_gap),
                width: line_height,
                height: line_width,
                fill: 'black'
            });
            group.add(rectH);
        }


            this.end_layer.add(group);
        
        // add the layer to the stage
        this.end_stage.add(this.end_layer);
    }   

    // 随机获取set
    Test.prototype.getTrialSet = function() {
        var ret = [];
        var candinateNum = Test.trial_datas.length, ret_size;
        if ( this.TRIALS_SIZE > candinateNum ) ret_size = candinateNum;
        else ret_size = this.TRIALS_SIZE;

        //alert(ret_size);

        // shuffle
        for (var idx = 0;idx < ret_size; idx++) {
            
            if ( this.isRandomTrial == true ) {
                var swap_idx = idx + Math.floor(Math.random()*( candinateNum-idx));
                var tmp = Test.trial_datas[idx];
                Test.trial_datas[idx] = Test.trial_datas[ swap_idx ];
                Test.trial_datas[ swap_idx] = tmp;
            }
            ret.push(Test.trial_datas[idx]);
        }
        return ret;
    }

    // 开始测试
    Test.prototype.start = function() {

        $('#start').hide();
        $('#trial').show();
        $('#result').hide();

        this.cur_trial_idx = 0;
        $('#trial_end').hide();
        $('#container').hide();
        $('#trial_front').show();
        this.trialStart();
    }

    Test.prototype.trialStart = function() {

        // step 1 +
        this.cur_trial_step = this.TRIAL_STEP_1;
        $('#trial_front').show();
        $("#trial_front").delay(this.TRIAL_STEP_1_WAIT_TIME).fadeOut('fast', function() {
            // step 2 blank
            test.cur_trial_step = test.TRIAL_STEP_2;

            $('#container').delay(test.TRIAL_STEP_2_WAIT_TIME).show(500, function() {
                // step 3 picture
                test.cur_trial_step = test.TRIAL_STEP_3;
                var date = new Date();
                test.wait_time = date.getTime();
                // 
                var cur_group = test.layer.get('#' + test.cur_trial_idx )[0];
                cur_group.show();
                test.layer.draw();

                $("#tmp").attr('idx', test.cur_trial_idx);
                $("#tmp").delay(test.TRIAL_STEP_3_WAIT_TIME).show('fast', function() {
                    // 已经不是此次
                    if ( $("#tmp").attr('idx') != test.cur_trial_idx || 
                        test.cur_trial_step != test.TRIAL_STEP_3  ) return ;
                    // 超时，自动选择
                    test.trialEnd(-1);
                })
            });
        });
        
        
        


        // step 4 #
    }

    Test.prototype.trialEnd = function(opt) {
        // step 3 hide picture
        var cur_group = this.layer.get('#' + this.cur_trial_idx )[0];
        var date = new Date();
        this.trial_set[ this.cur_trial_idx ].responseTime = date.getTime() - this.wait_time;
        this.trial_set[ this.cur_trial_idx ].opt = opt;
        cur_group.hide();
        test.layer.draw();
        $("#container").hide();
        // step 4 show #
        this.cur_trial_step = test.TRIAL_STEP_4;
        $("#trial_end").show();
        $("#trial_end").delay(this.TRIAL_STEP_4_WAIT_TIME).fadeOut('fast', function() {
            // show next 
            test.cur_trial_idx = test.cur_trial_idx + 1;
            if ( test.cur_trial_idx >= test.trial_set.length ) {
                // end
                test.showResult();
            } else {
                test.trialStart();
            }
        });


        
    }



    // 测试结束，显示结果
    Test.prototype.showResult = function() {
        $('#trial').hide();
        $('#result').show();

        var result_html = '';
        result_html = '<table class="table table-hover">';
        result_html += '<thead><th>次数</th>' +
                        '<th>垂直线长度</th>' +
                        '<th>水平线长度</th>' +
                        '<th>线条粗细</th>' +
                        '<th>线条颜色</th>' +
                        '<th>偏转角度</th>' +
                        '<th>是否中点提示</th>' +
                        '<th>空心圆半径</th>' +
                        '<th>反应键</th>' +
                        '<th>反应时(ms)</th>'+
                        '</thead>';
        result_html += '<tbody>';
        for(var idx=0; idx<this.trial_set.length;idx++) {
            var item = this.trial_set[idx];
            result_html += '<tr>' + 
                            '<td>' + (idx+1) + '</td>' +
                            '<td>' + item.vline_length + '</td>' +
                            '<td>' + item.hline_length + '</td>' +
                            '<td>' + item.line_width + '</td>' +
                            '<td>' + item.line_color + '</td>' +
                            '<td>' + item.rotationDeg + '</td>' +
                            '<td>' + item.mid_circle_show + '</td>' +
                            '<td>' + ( item.mid_circle_show == 'yes'? item.mid_circle_radius : '-') + '</td>' +
                            '<td>' + item.opt + '</td>' +
                            '<td>' + item.responseTime + '</td>' +
                            '</tr>';
        }
        result_html += '</tbody></table>';
        $('#result_table').html(result_html);
    }


    var test = new Test();

    exports.Test = Test;
    exports.test = test;

})(typeof global === "undefined" ? window : exports);
    