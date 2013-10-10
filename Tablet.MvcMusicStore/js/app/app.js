﻿;

"use strict";

(function (window, $, kendo, undefined) {
    var resizeTimer;
    var musicDashboard = {

        //kendoui router object
        router: undefined,

        //Default settings for gauges
        defaultGaugeMin: 100,
        defaultGaugeMax: 400,
        valueInterval: undefined,

        setup: function () {

            this.router = new kendo.Router();

            this.setupViews();
            this.setupRoutes();            

            this.router.start();

        },

        //define vars to Hold Views for SPA mgt
        mainView: undefined,
        salesView: undefined,
        socialView: undefined,

        //define views for KendoUI
        setupViews: function () {

            var that = this,
                sv = document.querySelector("#salesview"),
                socv = document.querySelector("#socialView"),
                mv = document.querySelector("#mainview");

            //outerHTML
            that.salesView = new kendo.View(sv.outerHTML);
            that.socialView = new kendo.View(socv.outerHTML);
            that.mainView = new kendo.View(mv.outerHTML);

        },

        //defined Routes for KendoUI
        setupRoutes: function () {

            var that = this;

            if (that.router) {

                that.router.route("/", function () {

                    that.salesView.destroy();
                    that.socialView.destroy();
                    
                    $(".main-nav-item-selected").removeClass("main-nav-item-selected");
                    $(".main-nav-item-icon-selected").removeClass("main-nav-item-icon-selected");
                    $(".nav-music-icon").addClass("main-nav-item-icon-selected");
                    $(".nav-music").addClass("main-nav-item-selected");

                    window.musicDashboard.mainViewLogic.createMainView();
                });

                that.router.route("/sales(/:target)", function (target) {

                    that.mainView.destroy();
                    that.socialView.destroy();

                    clearInterval(that.valueInterval);

                    $(".main-nav-item-selected").removeClass("main-nav-item-selected");
                    $(".main-nav-item-icon-selected").removeClass("main-nav-item-icon-selected");
                    $(".nav-sales-icon").addClass("main-nav-item-icon-selected");
                    $(".nav-sales").addClass("main-nav-item-selected");

                    window.musicDashboard.salesViewLogic.createSalesView(target);
                });

                that.router.route("/social", function () {

                    that.mainView.destroy();
                    that.salesView.destroy();

                    clearInterval(that.valueInterval);

                    $(".main-nav-item-selected").removeClass("main-nav-item-selected");
                    $(".main-nav-item-icon-selected").removeClass("main-nav-item-icon-selected");
                    $(".nav-social-icon").addClass("main-nav-item-icon-selected");
                    $(".nav-social").addClass("main-nav-item-selected");

                    window.musicDashboard.socialViewLogic.createSocialView();
                });

            }

        }
    };

    // redraw charts after a resize because they do not redraw themselves automatically.
    // use a timer to trigger the actual redraw so that there isn't flickering as the user drags the window handle.
    $(window).on("resize orientationchange", function (e) {
        if (resizeTimer) {
            window.clearTimeout(resizeTimer);
        }
        resizeTimer = window.setTimeout(function () {
            $(".k-chart:not(.k-stockchart)").each(function () { $(this).data("kendoChart").redraw(); });
            $(".k-stockchart").each(function () { $(this).data("kendoStockChart").redraw(); });
        }, 400);
    });

    return (window.musicDashboard = musicDashboard);

}(window, window.jQuery, window.kendo));