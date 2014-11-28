(function ($) {

    var initPageSplit = function (item) {
        var $this = $(item),
            $sections = $this.find(' > section'),
            rowData = {};

        $sections.each(function () {
            var $this = $(this),
                row = ($this.data('row') || 1).toString(),
                colCount = parseInt($this.data('cols'));
            $this.data('row', row).attr('data-row', row);
            if (typeof (rowData[row]) === 'undefined') {
                rowData[row] = {
                    columns: 0,
                    perColumn: 0
                };
            }

            rowData[row].columns += colCount;
            rowData[row].perColumn = 100 / rowData[row].columns;
        });

        for (var row in rowData) {
            $this.parent().find('[data-row="' + row + '"]').wrapAll('<div class="page-split-row" />');
        }

        $sections.each(function () {
            var $this = $(this),
                row = ($this.data('row') || 1).toString(),
                size = $this.data('cols') || 1,
                //TODO CIA FIX?
                fluid = $this.data('fluid') === true,
                $header = $this.find(' > header'),
                $footer = $this.find(' > footer'),
                hasHeader = $header.length > 0,
                hasFooter = $footer.length > 0,
                headerHeight = 0,
                footerHeight = 0;
            if (fluid) {
                $this.css('width', rowData[row].perColumn * size + '%');
            }
            if (hasHeader) {
                headerHeight = $header.height();
            }

            if (hasFooter) {
                footerHeight = $footer.height();
            }

            var $main = $this.find(' > main');

            if (hasHeader || hasFooter) {
                $this.css('overflow', 'hidden');
            }

            $this.attr('data-resize-listener', '1');

            $main.css({
                top: headerHeight + 'px',
                height: ($this.height() - headerHeight - footerHeight) + 'px'
            });

            $this.data('header', $header).data('footer', $footer).data('main', $main);
        });
        return $this;
    };

    var resizeHandler = function () {
        $('[data-resize-listener]').each(function () {

            var $this = $(this),
                $header = $this.data('header'),
                $footer = $this.data('footer'),
                $main = $this.data('main'),
                headerHeight = $header ? $header.height() * 1 : 0,
                footerHeight = $footer ? $footer.height() * 1 : 0;

            $main.css('top', headerHeight + 'px').css('height', '1px');
            $main.css('height', ($this.height() - headerHeight - footerHeight) + 'px');
        });
    };

    window.PageSplitResizeTimeout = 0;

    $(window).on('resize', function () {
        clearTimeout(window.PageSplitResizeTimeout);
        window.PageSplitResizeTimeout = setTimeout(resizeHandler, 100);
    });

    $.fn.pageSplit = function () {
        initPageSplit(this);
    };

    $(function () {
        $('.main-content').pageSplit();
        setTimeout(function () {
            $('.page-split').pageSplit();
            $(document).trigger('Adform:LayoutReady');
        }, 0);
    });

})(jQuery);