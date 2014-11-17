/*exported _SelectTemplates*/
var _SelectTemplates = {
    ulItems: '{{#each items}}<li data-placement="right" data-original-title="{{itemDescription}}" class="list-pop select-list-item {{#if selected}}selected{{/if}}" data-id="{{value}}" data-group="{{group}}"><div class="adform-checkbox{{#if disabled}} disabled{{/if}} {{#if selected}}checked{{/if}}" data-value="{{value}}"></div><label data-title="{{title}}">{{title}}</label></li>{{/each}}',
    itemList: '<div class="list {{#if single}}adform-select-single{{/if}}"><ul></ul><div class="no-results">{{noResults}}</div></div>',
    search: '<div class="head-search"><input type="text"><i class="adf-icon-small-search search-icon"></i><i class="adf-icon-small-reset reset-icon"></i></div>',
    footer: '<div class="footer"><div class="checkbox-group pull-right"><div class="adform-checkbox select-all {{#selectAllChkSelected}}checked{{/selectAllChkSelected}}"></div><label class="footer-label select-all-label">{{selectAllLabel}}</label></div><div class="dash">|</div><div class="checkbox-group pull-right"><div class="adform-checkbox {{#showSelected}}checked{{/showSelected}} show-selected"></div><label class="show-selected-label footer-label">{{showSelectedLabel}}</label></div></div>',
    dropdown: '<div class="hide tooltip info bottom-left adform-select-tooltip no-arrow"><div class="tooltip-inner select-container"><div class="adform-select"></div></div></div>',
    dropper: '<div tabindex="0" class="adform-select-dropper" href="#" draggable="false"><span class="value-holder"></span><i class="adf-icon-small-down pull-right"></i></div>'
};
/*exported SelectItemModel */
var SelectItemModel = Backbone.Model.extend({
    idAttribute: 'value',
    reset: function () {
        if (this.get('selected') === this.get('initSelected')) {
            return;
        }
        this.set('selected', this.get('initSelected'));

        this.trigger('change');
    }
});
/*global Handlebars, _SelectTemplates*/
/*exported SelectDropdownView */
var SelectDropdownView = Backbone.View.extend({

    template: Handlebars.compile(_SelectTemplates.dropdown),

    events: {
        'keydown': 'handleKeydown',
    },

    initialize: function (options) {
        this.options = options;
        if (typeof (this.options.template) === 'function') {
            this.template = this.options.template;
        }
        this.render();
        this.$list = this.$('.list');
        this.searchClass = 'adform-select-' + this.cid;
        this.$el.addClass(this.searchClass);

        this.visible = false;
    },

    render: function () {
        this.setElement($(this.template()).get(0));

        if (this.options.search) {
            this.$el.find('.adform-select').append(this.options.search.$el);
        }

        if (this.options.list) {
            this.$el.find('.adform-select').append(this.options.list.render().$el);
        }

        if (this.options.footer) {
            this.$el.find('.adform-select').append(this.options.footer.$el);
        }

        return this;
    },

    handleKeydown: function (e) {
        var stroke = e.keyCode;
        switch (stroke) {
            case 27:
                if (!this.options.disableEscape) {
                    var focusDropperOnClose = true;

                    this.hide(focusDropperOnClose);
                }
                break;
            case 13:
            case 32:
                if (this.$el.find('.hover').length > 0) {
                    this.$el.find('.hover label').trigger('click');
                    e.preventDefault();
                }
                break;
            case 38:
                e.preventDefault();
                this.handleUpArrow();
                break;
            case 40:
                e.preventDefault();
                this.handleDownArrow();
                break;
        }
    },

    handleUpArrow: function () {

        var current = this.$el.find('.hover');

        if (current.length === 0) {
            return;
        }

        var prev = current.prevAll(':visible:first');
        if (prev.length > 0) {
            current.removeClass('hover');
            prev.addClass('hover');

            var top = prev.position().top;
            if (top < this.firstItemTop) {
                this.$list[0].scrollTop = this.$list[0].scrollTop - prev.outerHeight();
            }
        }
    },

    handleDownArrow: function () {
        var current = this.$el.find('.hover');

        if (current.length === 0) {
            this.$el.find('li:first').addClass('hover');
            return;
        }

        var next = current.nextAll(':visible:first');
        if (next.length > 0) {
            current.removeClass('hover');
            next.addClass('hover');

            var bottom = next.outerHeight() + next.position().top;
            if (bottom > this.listBottom) {
                this.$list[0].scrollTop = this.$list[0].scrollTop + next.outerHeight();
            }
        }
    },

    scrollIntoView: function () {
        var selectedItems = this.$('li.selected');

        if (selectedItems.length > 0) {
            var first = $(selectedItems[0]);
            var top = first.position().top;
            var bottom = first.outerHeight() + top;

            if (bottom > this.listBottom) {
                this.$list[0].scrollTop = top - first.outerHeight() * 2;
            }
        }
    },

    hide: function (focusDropper) {

        if (focusDropper === undefined) {
            focusDropper = false;
        }

        if (!this.$el.hasClass('hide')) {
            this.$el.css('margin-top', this.originalMarginTop + 'px');
            this.$el.addClass('hide');

            this.visible = false;
            this.trigger('dropdown:hidden', focusDropper);
        }
    },

    setDropperHeight: function (height) {
        this.options.dropperHeight = height;
    },

    show: function () {

        this.$el.removeClass('hide');

        this.firstItemTop = this.firstItemTop || this.$('li').position().top;

        this.listBottom = this.listBottom || this.$list.height() + this.$list.position().top;

        if (!this.options.multiple) {
            this.scrollIntoView();
        }

        this.visible = true;

        this.trigger('dropdown:visible');
    },

    toggleVisibility: function (focusDropperOnClose) {

        focusDropperOnClose = focusDropperOnClose || false;

        if (this.$el.is(':visible')) {
            this.hide(focusDropperOnClose);
        } else {
            this.show();
        }
    }
});
/*global Handlebars, _SelectTemplates*/
/*exported SelectDropperView */
var SelectDropperView = Backbone.View.extend({
    template: Handlebars.compile(_SelectTemplates.dropper),

    events: {
        'click': 'handleClick',
        'keydown': 'handleKeydown',
        'mousedown': 'handleMouseDown',
        'blur': 'handleBlur',
        'focus': 'handleFocus'
    },

    initialize: function (options) {
        this.options = options;

        this.searchClass = 'adform-select-dropper-' + this.cid;
        this.options.base.on('change', this.handleChange, this);
        if (typeof (this.options.template) === 'function') {
            this.template = this.options.template;
        }
        this.render();


        this.$el.find('.std-tooltip').tooltip({
            trigger: 'manual',
            title: function () {
                return $(this).html().replace(/\s/g, '&nbsp;');
            }
        }).on('mouseenter', function (e) {
            var $element = $(e.target);

            if ($element.width() < $element[0].scrollWidth) {
                $element.tooltip('show');
            }
        }).on('mouseleave', function (e) {
            var $element = $(e.target);

            $element.tooltip('hide');
        });

    },

    render: function () {
        this.setElement($(this.template()).get(0));
        this.$el.addClass(this.searchClass);
        this.handleChange();
    },

    disable: function () {
        this.$el.addClass('disabled');
        this.options.disabled = true;
        this.undelegateEvents();
    },

    enable: function () {
        this.$el.removeClass('disabled');
        this.options.disabled = false;
        this.delegateEvents();
    },

    handleChange: function () {
        var selected = this.options.base.filter(function (model) {
            return model.get('value') !== '' && model.get('selected') === true;
        });

        var length = selected.length;
        this.$el.find('.value-holder').removeClass('placeholder');
        if (length > 1) {
            this.$el.find('.value-holder').html(window.AdformSelectComponent.Resourses.multipleSelection.replace('{0}', length));
        } else if (length === 1) {
            this.$el.find('.value-holder').text(selected.pop().get('title'));
        } else {
            this.$el.find('.value-holder').addClass('placeholder').html(this.options.placeholder);
        }
    },

    handleClick: function (e) {
        var focusDropperOnClose = true;

        this.trigger('dropper:toggleDropdown', focusDropperOnClose);
        e.preventDefault();
    },

    handleKeydown: function (e) {
        var key = e.keyCode;

        switch (key) {
            case 27:
                this.$el.blur();
                break;
            case 9:
            case 16:
            case 17:
            case 18:
            case 20:
            case 91:
            case 93:
                break;
            default:
                this.trigger('dropper:toggleDropdown');
        }
    },

    handleMouseDown: function (e) {
        // due to mousedown blur click event order in IE        
        e.preventDefault();
    },

    handleBlur: function () {
        this.trigger('dropper:blur');
    },

    handleFocus: function () {
        this.trigger('dropper:focus');
    },

    addActiveClass: function () {
        this.$el.addClass('active-control');
    },

    removeActiveClass: function () {
        this.$el.removeClass('active-control');
    }
});
/*global Handlebars, _SelectTemplates*/
/*exported SelectFooterView */
var SelectFooterView = Backbone.View.extend({
    template: Handlebars.compile(_SelectTemplates.footer),

    events: {
        'change .show-selected': 'handleShowSelected',
        'change .select-all': 'handleSelectAll'
    },

    initialize: function (options) {

        var labelText, showSelectedLabel;
        this.options = options;

        if (typeof (this.options.template) === 'function') {
            this.template = this.options.template;
        }

        if (typeof (this.options.base.selectAllVisibleResolver) === 'function') {
            this.options.allItemsSelected = !this.options.base.selectAllVisibleResolverWrapper();
            this.options.base.on('change:selected change:display', $.proxy(function () {
                if (this.options.base.selectAllVisibleHandler !== false) {
                    this.updateSelectAllLabel(!this.options.base.selectAllVisibleResolverWrapper());
                }
            }, this));
        }

        if (this.options.allItemsSelected) {
            labelText = window.AdformSelectComponent.Resourses.selectNone;
            showSelectedLabel = window.AdformSelectComponent.Resourses.showSelected;
            this.$el.html(this.template({
                selectAllChkSelected: true,
                selectAllLabel: labelText,
                showSelected: this.options.showSelected,
                showSelectedLabel: showSelectedLabel
            }));
        } else {
            labelText = window.AdformSelectComponent.Resourses.selectAll;
            showSelectedLabel = window.AdformSelectComponent.Resourses.showSelected;
            this.$el.html(this.template({
                selectAllChkSelected: false,
                selectAllLabel: labelText,
                showSelected: this.options.showSelected,
                showSelectedLabel: showSelectedLabel
            }));
        }

        var e = {
            target: this.$el.find('.show-selected')
        };
        this.handleShowSelected(e);
    },

    handleShowSelected: function (e) {
        if ($(e.target).hasClass('checked')) {
            this.$el.find('.show-selected-label').html(window.AdformSelectComponent.Resourses.showAll);
            this.trigger('footer:askToApplyFilter', {
                filter: 'selected',
                filterValue: true
            });
        } else {
            this.$el.find('.show-selected-label').html(window.AdformSelectComponent.Resourses.showSelected);
            this.trigger('footer:askToApplyFilter', {
                filter: 'selected',
                filterValue: undefined
            });
        }
    },

    handleSelectAll: function (e) {
        if (this.options.base.selectAllVisibleHandler !== false) {
            this.updateSelectAllLabel(!this.options.base.selectAllVisibleResolverWrapper());
        } else {
            if ($(e.target).hasClass('checked')) {
                this.$el.find('.select-all-label').html(window.AdformSelectComponent.Resourses.selectNone);
            } else {
                this.$el.find('.select-all-label').html(window.AdformSelectComponent.Resourses.selectAll);
            }
        }
        this.trigger('footer:toggleSelectAll');
    },

    updateSelectAllLabel: function (allVisibleSelected) {
        if (allVisibleSelected) {
            this.$el.find('.select-all-label').html(window.AdformSelectComponent.Resourses.selectNone);
        } else {
            this.$el.find('.select-all-label').html(window.AdformSelectComponent.Resourses.selectAll);
        }
    },

    registerCustomHandler: function (selector, event, handler) {

        this.elementsWithCustomHandlers = this.elementsWithCustomHandlers || [];

        this.elementsWithCustomHandlers.push(selector);

        this.$(selector).on(event, $.proxy(handler, this));
    },

    removeCustomHandlers: function () {
        if (this.elementsWithCustomHandlers && this.elementsWithCustomHandlers.length > 0) {
            var len = this.elementsWithCustomHandlers.length;

            for (var i = 0; i < len; i++) {
                this.$(this.elementsWithCustomHandlers[i]).off();
            }
        }
    }
});
/*global Handlebars, _SelectTemplates*/
/*exported SelectItemListView */
var SelectItemListView = Backbone.View.extend({
    events: {
        'change .adform-checkbox': 'handleCheckbox',
        'mouseenter li': 'handleMouseEnter',
        'mouseleave li': 'handleMouseLeave',
        'click .select-group-list-label': 'handleGroupTitleClick'
    },

    handleGroupTitleClick: function (e) {
        var parent = $(e.target.parentElement)
        //parent.find('li:hidden').toggle();

        if (parent.find('li:hidden').length === parent.find('li').length) {
            parent.find('li').show();
            return;
        }

        if (parent.find('li:visible').length === parent.find('li').length) {
            parent.find('li').hide();
            return;
        }

        if (parent.find('li:hidden').length !== parent.find('li:visible').length) {
            parent.find('li').show();
            return;
        }
    },

    handleMouseEnter: function (e) {
        var $element = $(e.currentTarget),
            $label = $element.data('label') || (function () {
                var $label = $element.find('label');
                $element.data('label', $label);
                return $label;
            })($element);

        this.$el.find('.hover').removeClass('hover');
        $element.addClass('hover');

        if ($.fn.tooltip && $label.outerWidth() < $label[0].scrollWidth) {
            $label
                .tooltip({
                    html: false,
                    title: $label.data('title'),
                    container: $element.parents('.adform-select-control')
                })
                .tooltip('show');
        }
    },

    handleMouseLeave: function (e) {
        var $element = $(e.currentTarget),
            $label = $element.data('label');

        $element.removeClass('hover');

        if ($.fn.tooltip) {
            $label.tooltip('destroy');
        }
    },

    handleCheckbox: function (e) {
        var $checkbox = $(e.currentTarget),
            id = $checkbox.data('value'),
            model = this.collection.get(id);

        if (!this.options.multiple && model.get('selected') === true) {
            this.askToCloseDropdown();
            return;
        }

        if (!this.options.multiple) {
            this.collection.each(function (model) {
                model.set('selected', false, {
                    silent: true
                });
            });
        }

        var newVal = $checkbox.hasClass('checked');

        model.set('selected', newVal);

        this.collection.checkIfAllVisibleSelected();
        if (!this.options.multiple) {
            this.askToCloseDropdown();
        }

        if (this.collection.filterConstraints.selected && !model.get('selected')) {
            model.set('display', false);
            this.displayOrHideNoResults();
        }
        e.stopPropagation();
    },

    template: Handlebars.compile(_SelectTemplates.itemList),
    listTemplate: Handlebars.compile(_SelectTemplates.ulItems),

    initialize: function (options) {
        this.options = options;
        if (typeof (this.options.template) === 'function') {
            this.template = this.options.template;
        }

        _.bindAll(this, 'setListItemsReferences');

        this.collection.on('change:display', this.updateDisplay, this);
        this.collection.on('change:selected', this.updateSelected, this);
    },

    updateDisplay: function () {
        this.collection.each(function (model) {
            var $li = this.listItems[model.id];

            if (model.get('display')) {
                $li.css('display', 'block');
            } else {
                $li.css('display', 'none');
            }
        }, this);
    },

    updateSelected: function () {
        this.collection.each(function (model) {
            var $li = this.listItems[model.id];

            if (model.get('selected') && !$li.hasClass('selected')) {
                $li.addClass('selected');
                $li.find('.adform-checkbox').addClass('checked');
            } else if (!model.get('selected') && $li.hasClass('selected')) {
                $li.removeClass('selected');
                $li.find('.adform-checkbox').removeClass('checked');
            }
        }, this);
    },

    render: function () {
        this.setElement(this.template({
            noResults: this.options.noResultsText,
            single: !this.options.multiple
        }));

        this.renderChildren();

        this.displayOrHideNoResults();

        return this;
    },

    displayOrHideNoResults: function () {
        if (this.collection.where({
            display: true
        }).length === 0) {
            this.$('.no-results').css('display', 'block');

            if (this.options.groups) {
                this.$el.find('.select-group-list').css('display', 'none');
            }
        } else {
            this.$('.no-results').css('display', 'none');

            if (this.options.groups) {
                this.$el.find('.select-group-list').css('display', 'block');
            }
        }
    },

    renderChildren: function () {
        var $list = this.$('ul'),
            listHTML = this.listTemplate({
                items: this.collection.toJSON()
            }),
            $listItems = $(listHTML);

        //References for $li elements for faster access
        this.listItems = {};

        $listItems.each(this.setListItemsReferences);
       
        //$($listItems[0]).data( "original-title", "Lorem Ipsum Dolor Sit Amen"  );
        //console.log($($listItems[0]));
       

        if (this.options.groups) {
            var groups = [];
            for (var i = 0; i < $listItems.length; i++) {
                if (groups.length === parseInt($listItems[i].dataset.group)) {
                    groups.push({ GroupId: groups.length, GroupName: this.collection.at(i).get("groupName"), Items: [] });
                    groups[groups.length-1].Items.push($listItems[i]);
                }
                else {
                    groups[groups.length-1].Items.push($listItems[i]);
                }
            }

            for (var i = 0; i < groups.length; i++) {
                var visibleId = i + 1;

                var tempGroup = "<ul class='select-group-list' data-id='" + visibleId + "'><div class='select-group-list-label' style='padding-left: 5px'>" + groups[i].GroupName + "</div></ul>";
                $list.append($(tempGroup).append(groups[i].Items));
            }
        }
        else {
            $list.append($listItems);
        }
    },

    setListItemsReferences: function (index, li) {
        this.listItems[li.getAttribute('data-id')] = $(li);
    },

    setHeight: function (height) {
        this.$el.css('min-height', height + 'px');
        this.$el.css('max-height', height + 'px');
    },

    resetSelected: function () {
        for (var i = 0; i < this.collection.models.length; i++) {
            this.collection.models[i].reset();
        }
    },

    askToCloseDropdown: function () {
        this.trigger('list:closeDropdown');
    }
});
/*global Handlebars, _SelectTemplates*/
/*exported SelectSearchView */
var SelectSearchView = Backbone.View.extend({

    events: {
        'input input': 'handleInput',
        'click i': 'reset'
    },

    timeout: 0,

    template: Handlebars.compile(_SelectTemplates.search),

    initialize: function (options) {
        this.options = options;
        if (typeof (this.options.template) === 'function') {
            this.template = this.options.template;
        }
        this.render();
    },

    render: function () {
        this.setElement($(this.template()).get(0));
        return this;
    },

    handleInput: function () {
        var term = this.$el.find('input').val();
        if (term.length > 0) {
            this.$el.find('.search-icon').css('display', 'none');
            this.$el.find('.reset-icon').css('display', 'block');
        } else {
            this.$el.find('.search-icon').css('display', 'block');
            this.$el.find('.reset-icon').css('display', 'none');
        }
        window.clearTimeout(this.timeout);

        this.timeout = window.setTimeout($.proxy(this.passTriggers, this, term, this.options.searchMechanism), 250);
    },

    focus: function () {
        this.$el.find('input').focus();
    },

    reset: function () {
        this.$el.find('input').val('');
        this.handleInput();
        this.trigger('input');
    },

    resetAndBlur: function () {
        this.reset();
        this.$el.find('input').blur();
    },

    passTriggers: function (term, searchMechanism) {
        searchMechanism = term !== '' ? searchMechanism : 'all';

        this.trigger('search:askToApplyFilter', {
            term: term,
            searchMechanism: searchMechanism
        });
    }
});
/*exported SelectItemCollection */
var SelectItemCollection = Backbone.Collection.extend({

    initialize: function () {
        this.filterConstraints = [];
        this.searchConstraint = {}; // cache search term here
    },

    saveSearchConstraint: function (term, mechanism) {
        this.searchConstraint = {
            term: term,
            mechanism: mechanism
        };
    },

    setConstraints: function (constraintArray, filter) {

        _.each(constraintArray, function (constraint) {

            this.filterConstraints[constraint.attribute] = constraint.value;

        }, this);

        if (filter) {

            var term = this.searchConstraint.term || '';
            var mechanism = this.searchConstraint.mechanism || 'all';

            this.filterResults(term, mechanism);
        }
    },

    removeConstraints: function (filter) {

        if (this.filterConstraints.selected !== undefined) {
            this.filterConstraints = [];
            this.filterConstraints.selected = true;
        } else {
            this.filterConstraints = [];
        }

        if (filter) {
            this.filterResults('', 'all');
        }
    },

    checkIfAllVisibleSelected: function () {
        if (typeof (this.selectAllVisibleResolver) === 'function') {
            return this.selectAllVisibleResolverWrapper();
        }
        var visible = this.filter(function (model) {
            return (model.get('value') !== '' && model.get('display') === true);
        });

        var visibleAndSelected = this.filter(function (model) {
            return (model.get('value') !== '' && model.get('display') === true && model.get('selected') === true);
        });

        if (visible.length === visibleAndSelected.length) {
            this.trigger('collection:allVisibleSelectionChanged', true);
        } else {
            this.trigger('collection:allVisibleSelectionChanged', false);
        }
    },

    filterResults: function (query, mechanism) {

        if (typeof (mechanism) === 'string') {
            mechanism = window.AdformSelectComponent.SearchMechanisms[mechanism];
        }

        if (typeof (mechanism) !== 'function') {
            mechanism = window.AdformSelectComponent.SearchMechanisms['default'];
        }

        // check all the models except the select all checkbox
        var models = this.filter(function (model) {
            return model.get('value') !== '';
        });

        var modelsLen = models.length;

        for (var i = 0; i < modelsLen; i++) {

            var model = models[i];

            var display = true;

            for (var key in this.filterConstraints) {
                if (this.filterConstraints.hasOwnProperty(key)) {
                    var constraint = this.filterConstraints[key];

                    if (key === 'length' || !this.filterConstraints.hasOwnProperty(key) || constraint === undefined) {
                        continue;
                    }

                    if (!constraint.hasOwnProperty('length')) { // is not an array

                        if (model.get(key) !== constraint) {
                            display = false;
                            break;
                        }

                    } else { // is an array 

                        var doesNotConform = true;
                        for (var j = 0; j < constraint.length; j++) {
                            if (constraint[j] === model.get(key).toString()) {
                                doesNotConform = false;
                                break;
                            }
                        }

                        if (doesNotConform) {
                            display = false;
                            break;
                        }
                    }
                }
            }

            if (display && mechanism(query, model)) {
                model.set('display', true, {
                    silent: true
                });
            } else {
                model.set('display', false, {
                    silent: true
                });
            }
        }

        this.trigger('change:display');

        this.trigger('collection:filteringCompleted');

        this.checkIfAllVisibleSelected();

        return this;
    },

    getFirstSelectedValue: function () {
        var list = this.where({
            selected: true
        });
        if (list.length === 0) {
            return null;
        }
        return list[0].get('value');
    },

    getValues: function () {
        var list = this.where({
            selected: true
        });

        if (list.length === 0) {
            return [];
        }

        var returnValue = [];
        for (var i = 0; i < list.length; i++) {
            returnValue.push(list[i].get('value'));
        }

        return returnValue;
    },

    getSelectedModels: function () {
        return this.filter(function (model) {
            return model.get('value') !== '' && model.get('selected');
        });
    },

    filterIfShowSelectedIsOn: function () {
        if (this.filterConstraints.selected === true) {

            var term = this.searchConstraint.term || '';
            var mechanism = this.searchConstraint.mechanism || 'all';

            this.filterResults(term, mechanism);
        }
    },

    setValues: function (values, options) {

        this.each(function (model) {
            model.set('selected', false, {
                silent: true
            });
        });

        for (var i = 0; i < values.length; i++) {
            var itemsToSet = this.where({
                value: values[i].toString()
            });

            if (itemsToSet.length > 0) {
                _.each(itemsToSet, this.setItemSelectedSilently);
            }
        }

        this.trigger('change:selected', options);
        this.checkIfAllVisibleSelected();
        this.filterIfShowSelectedIsOn();
    },

    setItemSelectedSilently: function (item) {
        item.set('selected', true, {
            silent: true
        });
    },

    setSelectedValueForAll: function (val) {

        this.each(function (item) {
            item.set({
                selected: val
            }, {
                silent: true
            });
        });

        this.trigger('change:selected');
        this.checkIfAllVisibleSelected();
        this.filterIfShowSelectedIsOn();
    },

    invertSelection: function () {
        this.each(function (model) {
            model.set({
                selected: !model.get('selected')
            }, {
                silent: true
            });
        });

        this.trigger('change:selected');
        this.checkIfAllVisibleSelected();
        this.filterIfShowSelectedIsOn();
    },

    selectAllVisible: function () {
        var visibleAndNotSelected = this.where({
            display: true,
            selected: false
        });

        _.each(visibleAndNotSelected, function (model) {
            model.set({
                selected: true
            }, {
                silent: true
            });
        });

        this.trigger('change:selected');
        this.checkIfAllVisibleSelected();
    },

    unselectAllVisible: function () {
        var visibleAndSelected = this.where({
            display: true,
            selected: true
        });
        _.each(visibleAndSelected, function (model) {
            model.set({
                selected: false
            }, {
                silent: true
            });
        });

        this.trigger('change:selected');
        this.checkIfAllVisibleSelected();
        this.filterIfShowSelectedIsOn();
    },

    selectAllVisibleResolverWrapper: function () {
        return this.selectAllVisibleResolver(
            _.map(this.where({
                display: true
            }), function (item) {
                return item.get('value');
            })
        );
    },

    toggleSelectAllVisible: function () {
        if (typeof (this.selectAllVisibleHandler) === 'function') {
            this.selectAllVisibleHandler(
                _.map(this.where({
                    display: true
                }), function (item) {
                    return item.get('value');
                })
            );
        } else {

            if (this.where({
                display: true,
                selected: false
            }).length > 0) {
                this.selectAllVisible();
            } else {
                this.unselectAllVisible();
            }

        }
    }
});
/*global SelectItemModel, SelectItemCollection, SelectItemListView, SelectSearchView, SelectFooterView, SelectDropperView, SelectDropdownView*/
/*exported _SelectTemplates*/
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

(function () {

    window.AdformSelectComponent = {};

    window.AdformSelectComponent.Resourses = {
        'multipleSelection': 'Multiple selection ({0})',
        'showSelected': 'Show selected',
        'showAll': 'Show all',
        'selectAll': 'Select all',
        'selectNone': 'Select none'
    };

    window.AdformSelectComponent.SearchMechanisms = {
        'default': function (query, item) {
            if (item.get('title').toLowerCase().trim().replace(/\s+/g, ' ').indexOf(query.trim().replace(/\s+/g, ' ').toLowerCase()) >= 0) {
                return true;
            }
            return false;
        },

        'all': function () {
            return true;
        }
    };

    /* DAS BIST API */
    var AdformSelect = function (selectElement, userOptions) {

        // extend itself with Backbone.Events
        _.extend(this, Backbone.Events);
        if ($(selectElement).length > 1) {
            var items = $(selectElement);
            for (var i = 0; i < items.length; i++) {
                $(items[i]).data('AdformSelect', new AdformSelect(items[i], userOptions));
            }
            return;
        }

        this.$el = $(selectElement);
        this.el = this.$el.get(0);

        userOptions = userOptions || {};

        this.options = {
            multiple: typeof (this.$el.attr('multiple')) === 'undefined' ? false : true,
            search: userOptions.search || false,
            footer: userOptions.footer || false,
            searchMechanism: userOptions.searchMechanism || 'default',
            /* possible values: 'auto' | 'container' | any valid CSS width values */
            width: userOptions.width || 'auto',
            templates: userOptions.templates || {},
            adjustDropperWidth: userOptions.adjustDropperWidth || false,
            disableOutsideClick: userOptions.disableOutsideClick || false,
            container: userOptions.container || false,
            selectAllVisibleHandler: userOptions.selectAllVisibleHandler || false,
            selectAllVisibleResolver: userOptions.selectAllVisibleResolver || false,
            adjustToViewport: userOptions.adjustToViewport || false,
            showSelected: userOptions.showSelected || false,
            disableEscape: userOptions.disableEscape || false,
            options: userOptions.options || false,
            groups: userOptions.groups || false,
            $offsetContainer: typeof (userOptions.offsetContainer) === 'undefined' ? false : $(userOptions.offsetContainer)
        };

        var noResults = this.$el.attr('data-no-results'),
            collection = [],
            allItemsSelected = true,
            optDefaults = {
                title: '',
                value: '',
                disabled: false,
                selected: false,
                display: true,
                initSelected: false,
                $selector: false
            },
            opt,
            opts;



        if (this.options.options instanceof Array) {

            this.options.multiple = userOptions.multiple || false;
            this.options.container = userOptions.container || this.$el;

            var forceSelectedAttribute = true;

            opts = this.options.options;

            for (var i2 = 0; i2 < opts.length; i2++) {
                opt = _.defaults(opts[i2], optDefaults);

                if (!this.options.multiple && opt.selected) {
                    opt.selected = forceSelectedAttribute;
                    forceSelectedAttribute = false;
                }

                if (opt.title !== '') {
                    collection.push(opt);
                }

                if (opt.selected === false) {
                    allItemsSelected = false;
                }
            }

        } else {
            if (userOptions.groups === true) {
                optgrps = $(selectElement).find('optgroup');

                var value, selected, title, group, groupName, disabled;

                for (var i = 0; i < optgrps.length; i++) {
                    group = i;
                    groupName = $(optgrps[i])[0].label;

                    var options = $(optgrps[i]).find('option');
                    
                    for (var ii = 0; ii < options.length; ii++) {
                        opt = $(options[ii]);

                        value = opt.attr('value');
                        selected = opt.attr('selected');
                        title = opt.text();
                        itemDescription = opt.data('desc');
                        disabled = opt.attr('disabled');

                        selected = typeof (selected) === 'undefined' ? false : true;
                        disabled = typeof (disabled) === 'undefined' ? false : true;

                        var obj = {
                            title: title,
                            group: group,
                            groupName: groupName,
                            itemDescription: itemDescription,
                            value: value,
                            disabled: disabled,
                            selected: selected,
                            display: true,
                            initSelected: selected,
                            $selector: opt
                        };

                        // set all data attributes
                        var attributes = opt.data();
                        for (var attr in attributes) {
                            if (attributes.hasOwnProperty(attr)) {
                                obj[attr] = attributes[attr];
                            }
                        }

                        if (title !== '') {
                            collection.push(obj);
                        }

                        if (selected === false) {
                            allItemsSelected = false;
                        }
                    }
                }


                
            }
            else {
                opts = $(selectElement).find('option');

                var value, selected, title, disabled;

                for (var ii = 0; ii < opts.length; ii++) {
                    opt = $(opts[ii]);
                    value = opt.attr('value');
                    selected = opt.attr('selected');
                    title = opt.text();
                    disabled = opt.attr('disabled');

                    selected = typeof (selected) === 'undefined' ? false : true;
                    disabled = typeof (disabled) === 'undefined' ? false : true;

                    var obj = {
                        title: title,
                        value: value,
                        disabled: disabled,
                        selected: selected,
                        display: true,
                        initSelected: selected,
                        $selector: opt
                    };

                    // set all data attributes
                    var attributes = opt.data();
                    for (var attr in attributes) {
                        if (attributes.hasOwnProperty(attr)) {
                            obj[attr] = attributes[attr];
                        }
                    }

                    if (title !== '') {
                        collection.push(obj);
                    }

                    if (selected === false) {
                        allItemsSelected = false;
                    }
                }
            }
        }


        if (typeof (this.options.search) === 'number') {
            var threshold = this.options.search;
            this.options.search = false;
            if (collection.length > threshold) {
                this.options.search = true;
            }
        }

        var baseCollection = new SelectItemCollection(collection, {
            model: SelectItemModel
        });

        baseCollection.selectAllVisibleHandler = this.options.selectAllVisibleHandler;
        baseCollection.selectAllVisibleResolver = this.options.selectAllVisibleResolver;

        var itemListView = new SelectItemListView({
            collection: baseCollection,
            template: this.options.templates.listView || false,
            noResultsText: noResults,
            groups: this.options.groups,
            multiple: this.options.multiple
        });


        var searchView = new SelectSearchView({
            base: baseCollection,
            template: this.options.templates.searchView || false,
            searchMechanism: this.options.searchMechanism
        });

        var footerView = new SelectFooterView({
            base: baseCollection,
            list: itemListView,
            template: this.options.templates.footerView || false,
            allItemsSelected: allItemsSelected,
            showSelected: this.options.showSelected
        });

        var dropperDisabled = (typeof (this.$el.attr('disabled')) === 'undefined' ? false : true);

        var dropperView = new SelectDropperView({
            base: baseCollection,
            placeholder: this.$el.attr('placeholder') || '',
            template: this.options.templates.dropperView || false
        });

        var dropdownView = new SelectDropdownView({
            'search': this.options.search ? searchView : false,
            'list': itemListView,
            'footer': this.options.footer ? footerView : false,
            template: this.options.templates.dropdownView || false,
            multiple: this.options.multiple,
            dropperHeight: 0,
            disableEscape: this.options.disableEscape
        });


        if (this.options.showSelected) {
            var array = [{
                attribute: 'selected',
                value: true
            }];
            baseCollection.setConstraints(array, true);
        }
        if (typeof (this.options.selectAllVisibleHandler) !== typeof (this.options.selectAllVisibleResolver)) {
            throw 'You must specify both selectAllVisibleHandler and selectAllVisibleResolver';
        }

        // events are delegated after the view init, so if undelegateEvents
        // is called during the initialize function, the events are reattached after it.
        if (dropperDisabled) {
            dropperView.disable();
        }

        var $selectContainer = $('<div class="adform-select-control"></div>');


        $selectContainer.append(dropperView.$el);
        $selectContainer.append(dropdownView.$el);

        if (this.options.container) {
            this.options.container.append($selectContainer);
        } else {
            this.$el.after($selectContainer);
        }

        this.$selectContainer = $selectContainer;
        this.validation = function (method) {
            if (method === 'isValid') {
                return !this.$selectContainer.hasClass('error');
            }
            return this.$selectContainer.validation(method, arguments[1]);
        };

        if (this.options.adjustDropperWidth) {
            $selectContainer.width(this.$el.outerWidth());
        } else {
            $selectContainer.width('100%');
        }

        dropdownView.setDropperHeight(dropperView.$el.outerHeight());

        if (this.$el.is('select:visible')) {
            this.$el.addClass('hide');
        }

        $.proxy(function () {
            if (this.$el.hasClass('error')) {
                $selectContainer.addClass('error');
            } else {
                $selectContainer.removeClass('error');
            }
        }, this);

        footerView.on('footer:applySearch', searchView.handleInput, searchView);
        baseCollection.on('collection:allVisibleSelectionChanged', footerView.updateSelectAllLabel, footerView);
        baseCollection.on('collection:filteringCompleted', itemListView.displayOrHideNoResults, itemListView);
        baseCollection.on('change:selected', dropperView.handleChange, dropperView);
        footerView.on('footer:toggleSelectAll', baseCollection.toggleSelectAllVisible, baseCollection);

        dropperView.on('dropper:toggleDropdown', dropdownView.toggleVisibility, dropdownView);

        dropperView.on('dropper:blur', function () {

            if (!dropdownView.visible) {
                this.$el.blur();
                // proxyToCheckErrorClass();    
            }

        }, this);

        dropperView.on('dropper:focus', function () {
            this.$el.trigger('click');
            // proxyToCheckErrorClass();
        }, this);

        this.dropdownView = dropdownView;

        var inViewFix = function () {
            if (this.options.$offsetContainer) {
                var $control = this.$selectContainer,
                    $dropdown = this.dropdownView.$el,
                    $container = this.options.$offsetContainer,
                    offsetTop = $control.offset().top - $container.offset().top,
                    dropDownLowerBorder = offsetTop + $control.outerHeight() + $dropdown.outerHeight(),
                    allowedLowerBorder = $container.height(),
                    dropDownUpperBorder = offsetTop - 6 - ($dropdown.outerHeight());
                if (dropDownLowerBorder > allowedLowerBorder && dropDownUpperBorder > 0) {
                    $dropdown.css('margin-top', 6 - ($control.outerHeight() + $dropdown.outerHeight()) + 'px');
                } else {
                    $dropdown.css('margin-top', '-5px');
                }
            }
        };

        itemListView.on('list:closeDropdown', dropdownView.hide, dropdownView);

        dropdownView.on('dropdown:hidden', searchView.resetAndBlur, searchView);

        dropdownView.on('dropdown:visible', inViewFix, this);
        dropdownView.on('dropdown:visible', searchView.focus, searchView);
        dropdownView.on('dropdown:visible', dropperView.addActiveClass, dropperView);

        dropdownView.on('dropdown:hidden', function (focusDropper) {

            dropdownView.$el.css('margin-top', dropdownView.$el.data('original-margin') + 'px');

            if (focusDropper) {
                dropperView.$el.focus();
            }

            dropperView.removeActiveClass();

            // unprefixed events for backward compatibility
            $(this).trigger('close');
            this.trigger('close');

            $(this).trigger('AdformSelect:close');
            this.trigger('AdformSelect:close');
        }, this);

        dropdownView.on('dropdown:visible', function () {

            this.fitToViewport();

            this.$el.trigger('click');
            // proxyToCheckErrorClass();
            this.setWidth(this.options.width);

            // unprefixed events for backward compatibility
            $(this).trigger('open');
            this.trigger('open');

            $(this).trigger('AdformSelect:open');
            this.trigger('AdformSelect:open');
        }, this);

        footerView.on('footer:askToApplyFilter', function (e) {
            var array = [{
                attribute: e.filter,
                value: e.filterValue
            }];
            baseCollection.setConstraints(array, true);
        }, this);

        searchView.on('search:askToApplyFilter', function (e) {
            baseCollection.saveSearchConstraint(e.term, e.searchMechanism);
            baseCollection.filterResults(e.term, e.searchMechanism);
        }, this);

        baseCollection.on('change:selected', function (e) {
            var passedEvent = e || {};
            var selectedModels = this.getSelectedModels();
            this.$el.find('option').removeAttr('selected');
            _.each(selectedModels, function (model) {
                var $selector = model.get('$selector');
                if ($selector) {
                    $selector.attr('selected', 'true');
                }
            });
            if (!passedEvent.silent) {
                // unprefixed events for backward compatibility
                $(this).trigger('selectionChanged');
                this.trigger('selectionChanged');

                $(this).trigger('AdformSelect:selectionChanged');
                this.trigger('AdformSelect:selectionChanged');

                // allow to bind to select tag change 
                //without having a reference to Adform Select
                this.$el.trigger('AdformSelect:selectionChanged');
                this.$el.trigger($.Event('change', {
                    isSelfTriggered: true
                }));
            }
        }, this);

        var proxyToOutsideClick = $.proxy(function (e) {
            var $target = $(e.target);

            var clickOnDropper = $target.hasClass(dropperView.searchClass) || $target.parents('.' + dropperView.searchClass).length !== 0;
            var clickOutside = $target.parents('.' + dropdownView.searchClass).length === 0;

            if (!clickOnDropper && clickOutside) {
                this.hideDropdown();
            }
        }, this);

        var proxyToSelectElementChange = $.proxy(function (e) {

            if (!e.isSelfTriggered) {
                var values = this.$el.val();
                if (typeof values === 'string') {
                    values = [values];
                }
                this.setValues(values);
            }
        }, this);

        this.$el.on('change', proxyToSelectElementChange);

        var proxyToAttributeUpdate = $.proxy(function () {
            if (typeof (this.$el.attr('disabled')) === 'undefined') {
                this.enable();
            } else {
                this.disable();
            }
        }, this);

        this.$el.on('AdformSelect:update', proxyToAttributeUpdate);


        if (!this.options.disableOutsideClick) {
            $(document).on('mouseup', proxyToOutsideClick);
        }

        this.getValue = function () {
            return baseCollection.getFirstSelectedValue();
        };

        this.getValues = function () {
            return baseCollection.getValues();
        };

        this.getSelectedModels = function () {
            return baseCollection.getSelectedModels();
        };

        this.setValues = function (values, options) {
            baseCollection.setValues(values, options);

            return this;
        };

        this.reset = function () {
            itemListView.resetSelected();
            return this;
        };

        this.setSelected = function (val) {
            baseCollection.setSelectedValueForAll(val);
        };

        this.selectAll = function () {
            this.setSelected(true);
            return this;
        };

        this.selectNone = function () {
            this.setSelected(false);
            return this;
        };

        this.invertSelect = function () {
            baseCollection.invertSelection();
            return this;
        };

        this.toggleSelect = function () {
            var functionToCall = baseCollection.where({
                selected: false
            }).length > 0 ? 'selectAll' : 'selectNone';
            this[functionToCall]();
            return this;
        };

        this.selectAllVisible = function () {
            baseCollection.selectAllVisible();
            return this;
        };

        this.unselectAllVisible = function () {
            baseCollection.unselectAllVisible();
            return this;
        };

        this.toggleSelectVisible = function () {
            baseCollection.toggleSelectAllVisible();
            return this;
        };

        this.showDropdown = function () {
            dropdownView.show();
            return this;
        };

        this.hideDropdown = function () {
            dropdownView.hide();
            return this;
        };

        this.toggleDropdown = function () {
            dropdownView.toggleVisibility();
            return this;
        };

        this.registerCustomFooterHandler = function (selector, event, handler) {
            if (this.options.footer) {
                footerView.registerCustomHandler(selector, event, handler);
            }
        };

        /*
            constraintArray must contain objects of form { attribute: a, value: [] }        
        */
        this.setDisplayConstraints = function (constraintArray) {

            var filterResults;

            if (searchView.$('input').val() === '') {
                filterResults = true;
                baseCollection.setConstraints(constraintArray, filterResults);
            } else {
                filterResults = false;
                baseCollection.setConstraints(constraintArray, filterResults);
                searchView.handleInput();
            }
        };

        this.removeDisplayConstraints = function (filter) {

            if (filter) {
                if (searchView.$('input').val() === '') {
                    baseCollection.removeConstraints(true);
                } else {
                    baseCollection.removeConstraints(false);
                    searchView.handleInput();
                }
            } else {
                baseCollection.removeConstraints(false);
            }
        };

        this.setHeight = function (height) {

            var searchHeight = this.options.search ? searchView.$el.outerHeight() : 0;
            var footerHeight = this.options.footer ? footerView.$el.outerHeight() : 0;

            var listHeight = height - searchHeight - footerHeight;

            itemListView.setHeight(listHeight);

        };

        this.setWidth = function (width) {
            var dropperWidth = dropperView.$el.outerWidth();

            if (width !== this.options.width) {
                this.options.width = width;
            }

            switch (width) {
                case 'auto':
                    break;

                case 'container':
                    dropdownView.$el.width(dropperWidth);
                    break;

                default:
                    dropdownView.$el.css('width', width);
                    break;
            }
        };

        this.getWidth = function () {
            return dropdownView.$el.outerWidth();
        };

        dropdownView.$el.data('original-margin', parseInt(dropdownView.$el.css('margin-top'), 10));

        this.fitToViewport = function () {
            if (!this.options.adjustToViewport) {
                return false;
            }
            var viewPortHeight = $(window).height();
            var bodyScrollTop = $('body').scrollTop();

            var dropDownRelativePosition = dropdownView.$el.offset().top - bodyScrollTop;
            var dropDownHeight = dropdownView.$el.outerHeight(true);
            var dropDownRelativePosition2 = dropDownRelativePosition - dropperView.$el.outerHeight() - dropDownHeight;

            if (dropDownRelativePosition + dropDownHeight + 20 > viewPortHeight && dropDownRelativePosition2 > 20) {
                dropdownView.$el.css('margin-top', (dropdownView.$el.data('original-margin') - dropperView.$el.outerHeight() - dropDownHeight) + 'px');
            } else {
                dropdownView.$el.css('margin-top', dropdownView.$el.data('original-margin') + 'px');
            }
        };

        this.enable = function () {
            this.$el.removeAttr('disabled');
            dropperView.enable();
        };

        this.disable = function () {
            this.$el.attr('disabled', '');
            dropperView.disable();
        };

        this.destroy = function () {
            baseCollection.off();

            baseCollection.each(function (model) {
                model.off();
                model = null;
            });

            footerView.removeCustomHandlers();

            itemListView.remove();
            searchView.remove();
            footerView.remove();
            dropdownView.remove();
            dropperView.remove();

            itemListView.off();
            searchView.off();
            footerView.off();
            dropdownView.off();
            dropperView.off();

            this.$el.off('change', proxyToSelectElementChange);
            this.$el.off('AdformSelect:update', proxyToAttributeUpdate);

            $(document).off('mouseup', proxyToOutsideClick);
            $selectContainer.remove();
            if (searchView.timeout) {
                clearTimeout(searchView.timeout);
            }
        };
    };

    window.AdformSelect = AdformSelect;

})();