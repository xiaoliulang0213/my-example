define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    // 楼盘视图
    /**
     * 约定：为方便显示，跃层的房屋均要保留（不显示，仅占位），设置特定标示（skipNum = -1）
     */
    vue.component('bv-building', {
        props: {
            entity: {
                default: function () {
                    return {
                        viewType: null
                    };
                }
            },
            /* 房屋描述占几列显示 */
            rowspan: {
                default: 3
            },
            // 每层每单元最多显示户数
            cellFloorNum: {
                default: 12
            },
            /*style: {
                default: function () {
                    return {
                        legendWidth: 118,
                        legendHeight: 23,
                        floorWidth: 60,
                        floorHeight: 23,
                        houseWidth: 80,
                        houseHeight: 23
                    };
                }
            },*/
            // 图例
            legendList: {
                default: function () {
                    return [];
                }
            },
            // 房屋性质列表
            propertyList: {
                default: function () {
                    return [];
                }
            },
            showHouse: {
                default: ''
            }
        },
        data: function () {
            return {
                cellFloorHouses: {},
                cellHouseNum: {},
                floorHouseNum: {},
                propertyCells: {},
                viewConfig: {},
                // TODO:
                floorHeight: 0
            }
        },
        created: function () {
            this.viewConfig = {
                layoutCols: 2,
                columns: [
                    {
                        name: 'viewType',
                        head: '显示模式',
                        edit: {
                            type: 'radio'
                        },
                        config: {
                            clazz: 'config-detail',
                            defaultValue: 'summary',
                            choose: [{code: 'summary', desc: '概要视图'}, {code: 'detail', desc: '详细视图'}],
                            onChange: this.changeViewType
                        }
                    }/*, {
                        name: 'cellFloorNum',
                        head: '每层显示房屋数',
                        config: {
                            clazz: 'cell-floor-num',
                            defaultValue: 12,
                            onChange: function (entity, value) {
                                //
                            }
                        }
                    }*/
                ]
            };
        },
        mounted: function () {
            /*var $container = $(this.$parent.$el);
            if (!$container.is('[data-container]')) {
                $container = $container.closest('[data-container]')
            }*/
            this.init();
            var vm = this;
            $(this.$el).on('click', 'input[type=checkbox]', function () {
                var position = $(this).attr('data-position');
                if (position === 'floor') {
                    // 按楼层
                    var floorNo = $(this).attr('data-floor');
                    if (util.checked(this)) {
                        // 选中
                        util.checked($('.house [data-floor=' + floorNo + ']', $(this).closest('.view-property')), true);
                    } else {
                        // 未选中
                        util.checked($('.house [data-floor=' + floorNo + ']', $(this).closest('.view-property')), false);
                    }
                    vm.checkCell($(this).closest('.view-property'));
                    vm.checkCol($(this).closest('.view-property'));
                } else if (position === 'cell') {
                    // 按单元
                    var cellNo = $(this).attr('data-cell');
                    if (util.checked(this)) {
                        // 选中
                        util.checked($('.house [data-cell=' + cellNo + ']', $(this).closest('.view-property')), true);
                    } else {
                        // 未选中
                        util.checked($('.house [data-cell=' + cellNo + ']', $(this).closest('.view-property')), false);
                    }
                    vm.checkFloor($(this).closest('.view-property'));
                    vm.checkCol($(this).closest('.view-property'), cellNo);
                } else if (position === 'house') {
                    // 按房屋
                    var floorNo = $(this).attr('data-floor');
                    var cellNo = $(this).attr('data-cell');
                    var colNo = $(this).attr('data-col');
                    if (util.checked(this)) {
                        // 选中
                    } else {
                        // 未选中
                    }
                    vm.checkCell($(this).closest('.view-property'), cellNo);
                    vm.checkFloor($(this).closest('.view-property'), floorNo);
                    vm.checkCol($(this).closest('.view-property'), cellNo, colNo);
                } else if (position === 'col') {
                    var cellNo = $(this).attr('data-cell');
                    var colNo = $(this).attr('data-col');
                    if (util.checked(this)) {
                        // 选中
                        util.checked($('.house [data-cell=' + cellNo + '][data-col=' + colNo + ']', $(this).closest('.view-property')), true);
                    } else {
                        // 未选中
                        util.checked($('.house [data-cell=' + cellNo + '][data-col=' + colNo + ']', $(this).closest('.view-property')), false);
                    }
                    vm.checkCell($(this).closest('.view-property'), cellNo);
                    vm.checkFloor($(this).closest('.view-property'));
                }
            });
        },
        beforeDestroy: function () {
            $(this.$el).off('click', 'input[type=checkbox]');
        },
        methods: {
            transCol: function (roomNo) {
                return util.toNumber(roomNo);
            },
            init: function () {
                $(this.$el).addClass('processing');
                /*if (!$container) {
                    $container = $(this.$el).closest('[data-container]');
                }
                util.style('.view-legend .head', {
                    width: this.style.legendWidth + 'px',
                    height: this.style.legendHeight + 'px'
                }, $container);
                util.style('.building .floors', {
                    width: (this.style.floorWidth + 4) + 'px'
                }, $container);
                util.style('.building .floors .floor span', {
                    width: this.style.floorWidth + 'px',
                    height: this.style.floorHeight + 'px',
                    'line-height': this.style.floorHeight + 'px'
                }, $container);
                util.style('.building .cells .cell .cell-floor', {
                    height: (this.style.floorHeight + 1) + 'px',
                    'line-height': (this.style.floorHeight + 1) + 'px'
                }, $container);
                util.style('.building .cells .cell .cell-name', {
                    height: this.style.floorHeight + 'px',
                    'line-height': this.style.floorHeight + 'px'
                }, $container);
                util.style('.building .cells .cell .cell-floor .house', {
                    width: this.style.houseWidth + 'px',
                    height: this.style.houseHeight + 'px',
                    'line-height': this.style.houseHeight + 'px'
                }, $container);

                for (var i=0; i<this.legendList.length; i++) {
                    util.style('.building .house.' + this.legendList[i].clazz, {
                        'background-color': this.legendList[i].color
                    }, $container);
                }*/
                // 处理单元、楼层对应房屋
                var cellFloorHouses = {};
                var cellHouseNum = {};
                var floorHouseNum = {};
                var propertyCells = {};
                for (var i=0; i<this.propertyList.length; i++) {
                    if (!util.isEmpty(this.propertyList[i].houseList)) {
                        for (var j=0; j<this.propertyList[i].houseList.length; j++) {
                            var cellNo = this.propertyList[i].houseList[j].cellNo;
                            var floorNo = this.propertyList[i].houseList[j].floorNo;
                            if (!cellFloorHouses[this.propertyList[i].propertyCode + '-' + floorNo]) {
                                cellFloorHouses[this.propertyList[i].propertyCode + '-' + floorNo] = {};
                            }
                            if (!cellFloorHouses[this.propertyList[i].propertyCode + '-' + floorNo][cellNo]) {
                                cellFloorHouses[this.propertyList[i].propertyCode + '-' + floorNo][cellNo] = [];
                            }
                            cellFloorHouses[this.propertyList[i].propertyCode + '-' + floorNo][cellNo].push(this.propertyList[i].houseList[j]);
                        }
                    }
                    for (var f=0; f<this.propertyList[i].cellList.length; f++) {
                        var cellNo = this.propertyList[i].cellList[f].cellNo;
                        var maxHouse = 0;
                        for (var pf in cellFloorHouses) {
                            if (util.startsWith(pf, this.propertyList[i].propertyCode + '-')) {
                                for (var cell in cellFloorHouses[pf]) {
                                    if (cellNo === cell && maxHouse < cellFloorHouses[pf][cell].length) {
                                        maxHouse = cellFloorHouses[pf][cell].length;
                                    }
                                }
                            }
                        }
                        cellHouseNum[this.propertyList[i].propertyCode + '-' + cellNo] = maxHouse;
                    }
                    for (var f=0; f<this.propertyList[i].floorList.length; f++) {
                        var floorNo = this.propertyList[i].floorList[f].floorNo;
                        var maxHouse = 0;
                        for (var p in cellFloorHouses[this.propertyList[i].propertyCode + '-' + floorNo]) {
                            if (maxHouse < cellFloorHouses[this.propertyList[i].propertyCode + '-' + floorNo][p].length) {
                                maxHouse = cellFloorHouses[this.propertyList[i].propertyCode + '-' + floorNo][p].length;
                            }
                        }
                        floorHouseNum[this.propertyList[i].propertyCode + '-' + floorNo] = maxHouse;
                    }
                    /*var cells = [];
                    if (!util.isEmpty(this.propertyList[i].cellList)) {
                        for (var j=0; j<this.propertyList[i].cellList.length; j++) {
                            cells.push(this.propertyList[i].cellList[j].cellNo);
                        }
                    }
                    propertyCells[this.propertyList[i].propertyCode] = cells;*/
                    propertyCells[this.propertyList[i].propertyCode] = null;
                }
                if (!util.isEmpty(cellFloorHouses)) {
                    this.cellFloorHouses = cellFloorHouses;
                }
                if (!util.isEmpty(cellHouseNum)) {
                    this.cellHouseNum = cellHouseNum;
                }
                if (!util.isEmpty(floorHouseNum)) {
                    this.floorHouseNum = floorHouseNum;
                }
                if (!util.isEmpty(propertyCells)) {
                    this.propertyCells = propertyCells;
                }
                /*this.legendList = data.legendList;
                this.propertyList = data.propertyList;*/
                this.layout();
                this.$nextTick(function () {
                    util.tooltip(this.$el, 'data-title', false, {
                        container: 'body'
                    });
                });
            },
            /*initCellFloorRowspan: function (cell, floor) {
                if (!this.cellFloorHouses[cell.cellNo + '-' + floor.floorNo]) {
                    return '';
                }
                var rowspan = util.toNumber((this.cellFloorHouses[cell.cellNo + '-' + floor.floorNo].length + this.cellFloorNum - 1) / this.cellFloorNum);
                if (rowspan > 1) {
                    return 'rowspan-' + rowspan;
                }
                return '';
            },*/
            initFloorRowspan: function (property, floor) {
                if (!this.floorHouseNum[property.propertyCode + '-' + floor.floorNo]) {
                    return '';
                }
                var rowspan = util.toNumber((this.floorHouseNum[property.propertyCode + '-' + floor.floorNo] + this.cellFloorNum - 1) / this.cellFloorNum);
                if (rowspan > 1) {
                    return 'rowspan-' + rowspan;
                }
                return '';
            },
            initCellHeadRowspan: function (property) {
                // cellHouseNum[el.propertyCode + '-' + cell.cellNo]
                var maxHouseNum = 0;
                for (var p in this.cellHouseNum) {
                    if (this.cellHouseNum[p] > maxHouseNum) {
                        maxHouseNum = this.cellHouseNum[p];
                    }
                }
                if (maxHouseNum <= this.cellFloorNum) {
                    return '';
                }
                if (this.entity.viewType === 'detail') {
                    var rowspan = util.toNumber((maxHouseNum + this.cellFloorNum - 1) / (this.cellFloorNum * 2));
                    if (rowspan > 1) {
                        return 'rowspan-' + rowspan;
                    }
                } else {
                    var rowspan = util.toNumber((maxHouseNum + this.cellFloorNum - 1) / this.cellFloorNum);
                    if (rowspan > 1) {
                        return 'rowspan-' + rowspan;
                    }
                }
                return '';
            },
            changeViewType: function () {
                this.layout();
                util.scroll();
            },
            changeCellView: function (event) {
                this.$nextTick(function () {
                    this.layout($('.cells-container .cells', $(event.target).closest('.view-property')));
                });
            },
            _showHouse: function (house) {
                if (this.showHouse && util.type(this.showHouse) === 'function') {
                    return this.showHouse.call(null, house, this.entity.viewType);
                }
            },
            layout: function ($cells) {
                this.$nextTick(function () {
                    if (!$(this.$el).hasClass('processing')) {
                        $(this.$el).addClass('processing');
                    }
                    var vm = this;
                    if ($cells) {
                        var w = 0;
                        $('.cell:visible', $cells).each(function () {
                            w += $(this).outerWidth(true);
                        });
                        $($cells).width(w);
                    } else {
                        $('.building .cells', vm.$el).each(function () {
                            var w = 0;
                            $('.cell:visible', this).each(function () {
                                w += $(this).outerWidth(true);
                            });
                            $(this).width(w);
                        });
                    }
                    $(vm.$el).removeClass('processing');
                    //this.processing = false;
                });
            },
            // 判断单元选中状态
            checkCell: function ($property, cellNo, $cell) {
                if (cellNo) {
                    var total = $('.house [data-cell=' + cellNo + ']', $property).length;
                    var checked = $('.house [data-cell=' + cellNo + ']:checked', $property).length;
                    if (total === 0 || checked === 0) {
                        if ($cell) {
                            util.checked($cell, false, false);
                        } else {
                            util.checked($('.cell-name [data-cell=' + cellNo + ']', $property), false, false);
                        }
                    } else if (checked < total) {
                        if ($cell) {
                            util.checked($cell, false, true);
                        } else {
                            util.checked($('.cell-name [data-cell=' + cellNo + ']', $property), false, true);
                        }
                    } else {
                        if ($cell) {
                            util.checked($cell, true, false);
                        } else {
                            util.checked($('.cell-name [data-cell=' + cellNo + ']', $property), true, false);
                        }
                    }
                } else {
                    var vm = this;
                    $('.cell-name [data-cell]', $property).each(function () {
                        vm.checkCell($property, $(this).attr('data-cell'), this);
                    });
                }
            },
            // 判断楼层选中状态
            checkFloor: function ($property, floorNo, $floor) {
                if (floorNo) {
                    var total = $('.house [data-floor=' + floorNo + ']', $property).length;
                    var checked = $('.house [data-floor=' + floorNo + ']:checked', $property).length;
                    if (total === 0 || checked === 0) {
                        if ($floor) {
                            util.checked($floor, false, false);
                        } else {
                            util.checked($('.floor [data-floor=' + floorNo + ']', $property), false, false);
                        }
                    } else if (checked < total) {
                        if ($floor) {
                            util.checked($floor, false, true);
                        } else {
                            util.checked($('.floor [data-floor=' + floorNo + ']', $property), false, true);
                        }
                    } else {
                        if ($floor) {
                            util.checked($floor, true, false);
                        } else {
                            util.checked($('.floor [data-floor=' + floorNo + ']', $property), true, false);
                        }
                    }
                } else {
                    var vm = this;
                    $('.floor [data-floor]', $property).each(function () {
                        vm.checkFloor($property, $(this).attr('data-floor'), this);
                    });
                }
            },
            // 判断单元-列选中状态
            checkCol: function ($property, cellNo, colNo, $col) {
                if (colNo) {
                    var total = $('.house [data-cell=' + cellNo + '][data-col=' + colNo + ']', $property).length;
                    var checked = $('.house [data-cell=' + cellNo + '][data-col=' + colNo + ']:checked', $property).length;
                    if (total === 0 || checked === 0) {
                        if ($col) {
                            util.checked($col, false, false);
                        } else {
                            util.checked($('.cell-col [data-cell=' + cellNo + '][data-col=' + colNo + ']', $property), false, false);
                        }
                    } else if (checked < total) {
                        if ($col) {
                            util.checked($col, false, true);
                        } else {
                            util.checked($('.cell-col [data-cell=' + cellNo + '][data-col=' + colNo + ']', $property), false, true);
                        }
                    } else {
                        if ($col) {
                            util.checked($col, true, false);
                        } else {
                            util.checked($('.cell-col [data-cell=' + cellNo + '][data-col=' + colNo + ']', $property), true, false);
                        }
                    }
                } else if (cellNo) {
                    if (util.checked($('.cell-name [data-cell=' + cellNo + ']', $property))) {
                        if ($col) {
                            util.checked($col, true, false);
                        } else {
                            util.checked($('.cell-col [data-cell=' + cellNo + ']', $property), true, false);
                        }
                    } else {
                        if ($col) {
                            util.checked($col, false, false);
                        } else {
                            util.checked($('.cell-col [data-cell=' + cellNo + ']', $property), false, false);
                        }
                    }
                } else {
                    var vm = this;
                    $('.cell-col [data-col]', $property).each(function () {
                        vm.checkCol($property, $(this).attr('data-cell'), $(this).attr('data-col'), this);
                    });
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-building')
    });
});