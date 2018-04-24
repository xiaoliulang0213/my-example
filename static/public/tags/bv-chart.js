define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-chart', {
        props: {
            clazz: {
                default: ''
            },
            width: {
                default: ''
            },
            height: {
                default: ''
            },
            // 支持bar
            type: {
                default: ''
            },
            labels: {
                default: ''
            },
            datasets: {
                default: ''
            },
            min: {
                default: 0
            },
            max: {
                default: ''
            }
        },
        data: function () {
            return {
                style: {}
            }
        },
        /*watch: {
            labels: {
                handler: function (val, oldVal) {
                    this.refresh();
                },
                deep: true
            },
            datasets: {
                handler: function (val, oldVal) {
                    this.refresh();
                },
                deep: true
            }
        },*/
        beforeCreate: function () {
            this.$chart = '';
        },
        mounted: function () {
            if (this.width) {
                vue.set(this.style, 'width', this.width);
                // this.style.width = this.width;
            }
            if (this.height) {
                vue.set(this.style, 'height', this.height);
                // this.style.height = this.height;
            }
            this.refresh();
        },
        methods: {
            refresh: function() {
                if (this.datasets && this.datasets.length > 0) {
                    for (var i=0; i<this.datasets.length; i++) {
                        var type = this.datasets[i].type || this.type;
                        if (type === 'line') {
                            if (!this.datasets[i].borderColor) {
                                this.datasets[i].borderColor = Const.chart.backgroundColors[i];
                            }
                            if (util.type(this.datasets[i].fill) === 'undefined') {
                                this.datasets[i].fill = false;
                            }
                        } else if (type === 'pie' || type === 'doughnut') {
                            if (!this.datasets[i].backgroundColor) {
                                this.datasets[i].backgroundColor = Const.chart.backgroundColors;
                            }
                        } else  {
                            if (!this.datasets[i].backgroundColor) {
                                this.datasets[i].backgroundColor = Const.chart.backgroundColors[i];
                            }
                        }
                    }
                }
                if (!this.$chart) {
                    var ctx = $('canvas', this.$el)[0];
                    var options = {};
                    if (this.type != 'pie') {
                        options = {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        min: this.min,
                                        max: this.max
                                    }
                                }]
                            }
                        };
                    }
                    if (!options.legend) {
                        options.legend = {};
                    }
                    if (!options.legend.position) {
                        options.legend.position = 'left';
                    }
                    this.$chart = new Chart(ctx, {
                        type: this.type,
                        data: {
                            labels: this.labels,
                            datasets: this.datasets
                        },
                        options: options
                    });
                } else {
                    // this.$chart.type = this.type;
                    this.$chart.data.labels = this.labels;
                    this.$chart.data.datasets = this.datasets;
                }
                this.$chart.update();
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-chart')
    });
});