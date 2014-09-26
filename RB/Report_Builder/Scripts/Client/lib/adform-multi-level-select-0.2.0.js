/*exported TreeModel */
var TreeModel = Backbone.Model.extend({
    defaults: {
        isSelected: false,
        isChecked: false,
        isPreSelected: false,
        isHighlighted: false,
        hasHighlightedDescendants: false,
        parentID: undefined
    },
    STATES: {
        DESELECTED: {
            isChecked: false,
            isPreSelected: false
        },
        SELECTED: {
            isChecked: true,
            isPreSelected: false
        },
        PRE_SELECTED: {
            isChecked: true,
            isPreSelected: true
        }
    },
    initialize: function () {
        this.on('change', this.setIsSelected, this);
        this.on('change:children', this.bindChildrenCollectionEvents);

        this.resolveModelState();
    },
    bindChildrenCollectionEvents: function (model) {
        var children = model.get('children');

        children.on('selection', model.updateSelectedState, model);
        children.on('highlight', model.updateHighlightedState, model);

        model.on('change:isChecked', model.updateChildrenCollectionState);
    },
    resolveModelState: function () {
        var isSelected = this.get('isSelected');

        if (isSelected) {
            this.set(this.STATES.SELECTED);
        } else {
            this.set(this.STATES.DESELECTED);
        }
    },
    updateChildrenCollectionState: function (model) {
        var childrenCollection = model.get('children'),
            isPreSelected = model.get('isPreSelected'),
            isChecked = model.get('isChecked');

        if (!isPreSelected) {
            if (isChecked) {
                childrenCollection.invoke('select');
            } else {
                childrenCollection.invoke('deselect');
            }
        }
    },
    setIsSelected: function () {
        var isPreSelected = this.get('isPreSelected'),
            isChecked = this.get('isChecked'),
            isSelected = isChecked && !isPreSelected;

        this.set('isSelected', isSelected);
    },
    updateSelectedState: function () {
        var children = this.get('children'),
            status = children.getChildrenSelectionStatus(),
            stateObject = {};

        switch (status) {
        case 'all':
            stateObject = this.STATES.SELECTED;
            break;
        case 'none':
            stateObject = this.STATES.DESELECTED;
            break;
        case 'partial':
            stateObject = this.STATES.PRE_SELECTED;
            break;
        }
        this.set(stateObject);
    },
    updateHighlightedState: function () {
        var children = this.get('children'),
            hasHighlightedDescendants = children.hasHighlightedDescendants();

        this.setHasHighlightedDescendants(hasHighlightedDescendants);
    },
    toJSON: function () {
        var JSON = Backbone.Model.prototype.toJSON.apply(this, arguments);

        delete JSON.isChecked;
        delete JSON.isPreSelected;
        delete JSON.isHighlighted;
        delete JSON.hasHighlightedDescendants;

        if (JSON.children) {
            delete JSON.children;
        }

        return JSON;
    },
    select: function () {
        this.set(this.STATES.SELECTED);
    },
    deselect: function () {
        this.set(this.STATES.DESELECTED);
    },
    highlight: function () {
        if (this.isHighlighted()) {
            this.trigger('change:isHighlighted', this, true);
        } else {
            this.set('isHighlighted', true);
        }
    },
    dehighlight: function () {
        this.set('isHighlighted', false);
    },
    setHasHighlightedDescendants: function (hasHighlightedDescendants) {
        this.set('hasHighlightedDescendants', hasHighlightedDescendants);
    },
    isSelected: function () {
        var isSelected = this.get('isSelected');
        return isSelected;
    },
    isPreSelected: function () {
        var isPreSelected = this.get('isPreSelected');
        return isPreSelected;
    },
    isHighlighted: function () {
        var isHighlighted = this.get('isHighlighted');
        return isHighlighted;
    },
    hasHighlightedDescendants: function () {
        var hasHighlightedDescendants = this.get('hasHighlightedDescendants');

        return hasHighlightedDescendants;
    }
});
/*exported MultiLevelSelectContainerView */
var MultiLevelSelectContainerView = Backbone.View.extend({
    className: 'multi-level-select-container',
    events: {
        'change #general-checkbox': 'updateCollectionState',
        'keyup #searchbox': 'searchFieldChanged'
    },

    initialize: function (options) {
        this.$treeElement = options.$treeElement;
        this.collection = options.collection;
        this.SEARCH_LENGTH_THRESHOLD = options.SEARCH_LENGTH_THRESHOLD;

        this.collection.on('change', this.updateCheckboxState, this);
    },

    render: function () {
        this.renderSearchBox();
        this.renderToggleAllCheckBox();
        this.$el.append(this.$treeElement);
    },

    renderSearchBox: function () {
        var $searchContainer = $('<div class="search-container"></div>'),
            $searchIcon = $('<span class="add-in"><i class="adf-icon-small-search"></i></span>');

        // TODO: fix use resources
        this.$searchbox = $('<input id="searchbox" type="text" placeholder="Search..." title="" style="">');

        $searchContainer.append(this.$searchbox);
        $searchContainer.append($searchIcon);

        this.$el.append($searchContainer);
    },

    renderToggleAllCheckBox: function () {
        var $checkboxContainer = $('<div class="general-checkbox-container"></div>'),
            $label = $('<label>All</label>'); // TODO: fix use resources

        this.$checkbox = $('<div id="general-checkbox" class="adform-checkbox" tabindex="0"></div>');

        $checkboxContainer.append(this.$checkbox);
        $checkboxContainer.append($label);

        this.$el.append($checkboxContainer);
        this.updateCheckboxState();
    },

    updateCheckboxState: _.debounce(function () {
        var selectedModelsCount = this.collection.getSelectedModelsCount(),
            isChecked = (selectedModelsCount > 0),
            isPreSelected = isChecked && (selectedModelsCount !== this.collection.length);

        this.$checkbox.removeClass('checked');
        this.$checkbox.removeClass('pre');

        if (isChecked) {
            this.$checkbox.addClass('checked');
        }
        if (isPreSelected) {
            this.$checkbox.addClass('pre');
        }
    }, 10),

    updateCollectionState: function (event) {
        var $checkbox = $(event.target),
            isChecked = $checkbox.hasClass('checked');

        if (isChecked) {
            this.collection.selectAll();
        } else {
            this.collection.deselectAll();
        }
    },

    searchFieldChanged: _.debounce(function () {
        var searchCategory = this.$searchbox.val();

        if (searchCategory.length >= this.SEARCH_LENGTH_THRESHOLD) {
            this.collection.highlightModelsContainingCategory(searchCategory);
        } else {
            // clear highlighting
            this.collection.highlightModelsContainingCategory(null);
        }
    }, 300)
});
/*exported TreeCollectionView */
var TreeCollectionView = Backbone.View.extend({
    tagName: 'ul',
    className: 'multi-level-select',
    initialize: function (options) {
        this.isRootElement = options.isRootElement;
    },
    
    render: function () {
        if (this.isRootElement) {
            this.$el.addClass('multi-level-select-root');
        }
        this.renderTreeModels();
    },
    
    renderTreeModels: function () {
        var fragment = document.createDocumentFragment();
        this.collection.each(function (treeModel) {
            var treeModelView = new TreeModelView({
                model: treeModel
            });
            treeModelView.render();
            fragment.appendChild(treeModelView.el);
        }, this);

        this.$el.append(fragment);
    }
});
/*exported TreeModelView */
var TreeModelView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'change .adform-checkbox': 'updateModelState',
        'click .toggler': 'handleToggleClick'
    },
    initialize: function () {
        var children = this.model.get('children');

        this.model.on('change', this.handleDataChanges, this);
        this.model.on('change:hasHighlightedChildren', this.handleHasHighlightedChildrenChange, this);

        if (children instanceof TreeCollection) {
            children.on('highlight', this.handleChildrenHighlight, this);
        }
    },
    render: function () {
        var fragment = document.createDocumentFragment(),
            children = this.model.get('children');

        this.createElements();

        fragment.appendChild(this.$icon.get(0));
        fragment.appendChild(this.$checkbox.get(0));
        fragment.appendChild(this.$label.get(0));

        if (children instanceof TreeCollection) {
            this.$icon.removeClass('invisible');
        }

        this.$el.append(fragment);

        if (this.model.hasHighlightedDescendants()) {
            this.showChildren();
        }
    },
    renderChildren: function () {
        var children = this.model.get('children'),
            treeCollectionView;

        if (children instanceof Backbone.Collection) {
            treeCollectionView = new TreeCollectionView({
                collection: children
            });
            treeCollectionView.render();

            this.$children = treeCollectionView.$el;
            this.$children.hide();

            this.$el.append(this.$children);
        }
        this.isChildrenRendered = true;
    },
    createElements: function () {
        this.$icon = $('<i class="ico-expand toggler invisible"></i>');
        this.$checkbox = $('<div class="adform-checkbox" tabindex="0" data-id="' + this.model.id + '"></div>');

        if (this.model.get('isChecked')) {
            this.$checkbox.addClass('checked');
            if (this.model.get('isPreSelected')) {
                this.$checkbox.addClass('pre');
            }
        }

        this.$label = $('<label>' + this.model.get('name') + '</label>');
        if (this.model.isHighlighted()) {
            this.$label.addClass('highlighted');
        }
    },
    updateModelState: function (event) {
        var $checkbox = $(event.currentTarget),
            isChecked = $checkbox.hasClass('checked');

        if ($checkbox.get(0) === this.$checkbox.get(0)) {
            if (isChecked) {
                this.model.select();
            } else {
                this.model.deselect();
            }
        }
    },
    handleDataChanges: function () {
        var isChecked = this.model.get('isChecked'),
            isPreSelected = this.model.get('isPreSelected'),
            isHighlighted = this.model.get('isHighlighted');

        this.$checkbox.toggleClass('checked', isChecked);
        this.$checkbox.toggleClass('pre', isPreSelected);
        this.$label.toggleClass('highlighted', isHighlighted);
    },
    handleChildrenHighlight: function (children) {
        if (children.hasHighlightedDescendants()) {
            this.showChildren();
        }
    },
    handleHasHighlightedChildrenChange: function (model, hasHighlightedChildren) {
        if (hasHighlightedChildren) {
            this.showChildren();
        }
    },
    handleToggleClick: function (event) {
        var $clickTarget = $(event.target),
            isClickOnSelf = $clickTarget.get(0) === this.$icon.get(0),
            hasChildren = this.model.has('children');

        if (hasChildren && isClickOnSelf) {
            if (!this.$icon.hasClass('expanded')) {
                this.showChildren();
            } else {
                this.hideChildren();
            }
            event.stopPropagation();
        }
    },
    showChildren: function () {
        if (!this.isChildrenRendered) {
            this.renderChildren();
        }
        this.toggleChildrenVisibility(true);
    },
    hideChildren: function () {
        this.toggleChildrenVisibility(false);
    },
    toggleChildrenVisibility: function (hasToBeDisplayed) {
        var eventType;

        if (hasToBeDisplayed) {
            eventType = 'expanded';
        } else {
            eventType = 'collapsed';
        }

        this.$children.toggle(hasToBeDisplayed);
        this.$icon.toggleClass('expanded', hasToBeDisplayed);

        this.$el
            .trigger($.Event(eventType, {
                children: this.$children
            }));
    }
});
/*exported LinearCollection */
var LinearCollection = Backbone.Collection.extend({
    model: TreeModel,
    add: function (models) {
        Backbone.Collection.prototype.add.apply(this, arguments);

        this.each(function (model) {
            var childrenModels = this.where({
                parentID: model.id
            }),
                childrenTreeCollection;

            if (childrenModels.length) {
                childrenTreeCollection = new TreeCollection(childrenModels);
                model.set('children', childrenTreeCollection);
            }
        }, this);
        this._updateModelsState();
    },
    getRootModels: function () {
        var rootModels = this.filter(function (model) {
            var hasParentID = Boolean(model.get('parentID'));
            return !hasParentID;
        });
        return rootModels;
    },
    getSelectedIDs: function () {
        var selectedModels = this._getSelectedModels(),
            selectedIDs = _.pluck(selectedModels, 'id');
        return selectedIDs;
    },
    select: function (ids) {
        var models = this._getModelsByIDs(ids);
        _.invoke(models, 'select');
    },
    deselect: function (ids) {
        var models = this._getModelsByIDs(ids);
        _.invoke(models, 'deselect');
    },
    selectAll: function () {
        this.invoke('select');
    },
    deselectAll: function () {
        this.invoke('deselect');
    },
    getSelectedModelsCount: function () {
        return this._getSelectedModels().length;
    },
    highlightModelsContainingCategory: function (searhCategory) {
        this.each(function (model) {
            var lowerCaseName = model.get('name').toLowerCase(),
                lowerCaseSearchCategory = searhCategory ? searhCategory.toLowerCase() : searhCategory;

            if (lowerCaseName.indexOf(lowerCaseSearchCategory) !== -1) {
                model.highlight();
            } else {
                model.dehighlight();
            }
        });
    },
    _updateModelsState: function () {
        var selectedModels = this._getSelectedModels();
        _.each(selectedModels, this._updateParentModelState, this);
    },
    _getModelsByIDs: function (ids) {
        var models = [];

        ids = this._convertValues(ids);
        if (ids) {
            models = this.filter(function (model) {
                var modelID = String(model.id),
                    isRightModel = (_.indexOf(ids, modelID) !== -1);

                return isRightModel;
            }, this);
        }

        return models;
    },
    _convertValues: function (ids) {
        var type;
        if (!_.isArray(ids)) {
            type = typeof ids;

            switch (type) {
            case 'number':
                ids = [String(ids)];
                break;
            case 'string':
                ids = [ids];
                break;
            default:
                return false;
            }
        } else {
            ids = _.map(ids, function (value) {
                return String(value);
            });
        }
        return ids;
    },
    _getSelectedModels: function () {
        var selectedModels = this.filter(function (model) {
            return model.isSelected();
        });
        return selectedModels;
    },
    _updateParentModelState: function (model) {
        var parentID = model.get('parentID'),
            parentModel;
        if (parentID) {
            parentModel = this.get(parentID);
            if (parentModel) {
                parentModel.updateSelectedState();
                this._updateParentModelState(parentModel);
            }
        }
    }
});
/*exported TreeCollection */
var TreeCollection = Backbone.Collection.extend({
    model: TreeModel,
    initialize: function (models, options) {
        this.on('change:isSelected change:isChecked change:isPreSelected', _.debounce(this.handleModelsChanges, 10), this);
        this.on('change:isHighlighted change:hasHighlightedDescendants', _.debounce(this.handleHighlightChanges, 10), this);
    },
    getChildrenSelectionStatus: function () {
        var selectedModels = this.filter(function (model) {
            return model.isSelected();
        }),
            preSelectedModels = this.filter(function (model) {
                return model.isPreSelected();
            }),
            status;

        if (selectedModels.length === this.length) {
            status = 'all';
        } else {
            if (selectedModels.length > 0 || preSelectedModels.length > 0) {
                status = 'partial';
            } else {
                status = 'none';
            }
        }
        return status;
    },
    hasHighlightedDescendants: function () {
        var highlightedDescendants = this.filter(function (model) {
            var isHighlighted = model.isHighlighted(),
                hasHighlightedDescendants = model.hasHighlightedDescendants();

            return isHighlighted || hasHighlightedDescendants;
        }),
            hasHighlightedDescendants = (highlightedDescendants.length > 0);

        return hasHighlightedDescendants;
    },
    handleModelsChanges: function () {
        this.trigger('selection');
    },
    handleHighlightChanges: function (model) {
        this.trigger('highlight', this);
    }
});
var MultiLevelSelect = function (options) {
    var rootModels,
        searchLengthThreshold = options.SEARCH_LENGTH_THRESHOLD || 1;

    this._linearCollection = new LinearCollection(options.data);

    rootModels = this._linearCollection.getRootModels();

    this._treeCollection = new TreeCollection(rootModels);

    this._treeCollectionView = new TreeCollectionView({
        isRootElement: true,
        collection: this._treeCollection
    });
    this._treeCollectionView.render();

    this._multiSelectContainerView = new MultiLevelSelectContainerView({
        $treeElement: this._treeCollectionView.$el,
        collection: this._linearCollection,
        SEARCH_LENGTH_THRESHOLD: searchLengthThreshold
    });

    this._multiSelectContainerView.render();

    this.$element = this._multiSelectContainerView.$el;

    _.extend(this, Backbone.Events);

    this._proxyEvents();
};

MultiLevelSelect.prototype = {
    _proxyEvents: function () {
        this._linearCollection.on('change', _.debounce(function (model, options) {
            this.$element.trigger('change');
        }, 50), this);
    },
    selectAll: function () {
        this._linearCollection.selectAll();
    },
    deselectAll: function () {
        this._linearCollection.deselectAll();
    },
    set: function (data) {
        this._linearCollection.set(data);
    },
    get: function () {
        return this._linearCollection.toJSON();
    },
    getSelectedIDs: function () {
        return this._linearCollection.getSelectedIDs();
    },
    select: function (ids) {
        this._linearCollection.select(ids);
    },
    deselect: function (ids) {
        this._linearCollection.deselect(ids);
    }
};