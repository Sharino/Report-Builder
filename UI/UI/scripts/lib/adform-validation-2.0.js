;
(function ($) {

    var validationMessages = {
        email: 'Incorrect email',
        required: 'Required',
        price: 'Invalid price',
        number: 'Only numbers',
        digits: 'Only digits',
        alphanum: 'Only alphanumeric values',
        date: 'Invalid date',
        url: 'Invalid URL',
        equals: 'Should be equal to %s field'
    },
        matchingPaterns = {
            alphanum: /^\w+$/,
            date: /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/,
            digits: /^\d+$/,
            email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
            number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
            price: /^[0-9]+(\.\d{1,2})?$/,
            required: /.+/,
            urlStart: /^(https?|s?ftp|git)/i,
            url: /^(https?|s?ftp|git):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
        },
        formatMessage = function (message, args) {
            // if ( 'object' === typeof args ) {
            //   for ( var i in args ) {
            //     message = this.formatMesssage( message, args[ i ] );
            //   }
            //   return message;
            // }
            return message.replace(new RegExp('%s', 'i'), args);
        },
        handle = {
            interaction: function (event) {
                var $element = $(this),
                    validationData = $element.attr('data-validate'),
                    validationMethods = (validationData !== undefined) ? validationData.split(' ') : [],
                    methodCount = validationMethods.length;
                if (methodCount) {
                    handle.validation($element, validationMethods, methodCount, event);
                }
            },
            getErrorMessageObject: function (error) {
                var result = {
                    message: error
                };
                return result;
            },
            customError: function ($element, errors) {
                var errorsList = [];
                if (typeof errors === 'string') {
                    errorsList.push(handle.getErrorMessageObject(errors));
                } else if (errors instanceof Array) {
                    errorsList = $.map(errors, handle.getErrorMessageObject);
                }
                $element
                    .attr('custom-error', '')
                    .trigger($.Event('invalid', {
                        errors: errorsList
                    }));
            },
            testValue: function (type, value, $element) {
                var pattern, isEmptyValid,
                    result = {
                        type: type,
                        message: validationMessages[type] || "Not defined"
                    },
                    $equalsElement;

                value = (value === null) ? '' : value;

                isEmptyValid = ((value.length === 0) && !/(^required$)|(^equals$)/.test(type));
                if (isEmptyValid) {
                    result.isValid = true;
                    return result;
                }
                pattern = matchingPaterns[type];
                switch (type) {
                    case 'required':
                        // Handle special case for chekcbox and radio button
                        if (/(checkbox)|(radio)/.test($element.attr('type'))) {
                            result.isValid = $element.attr('checked');
                            return result;
                        }
                        break;
                    case 'price':
                        value = value.replace(',', '.');
                        break;
                    case 'email':
                        value = value.split(/\s*,\s*|\s*;\s*/);
                        pattern = {
                            test: function (emails) {
                                var result = true;
                                var atLeastOneEmail = false;
                                $.each(emails, function (index, value) {
                                    var validEmail = matchingPaterns.email.test(value);
                                    atLeastOneEmail = atLeastOneEmail || validEmail;
                                    result = result && (validEmail || $.trim(value) === "");
                                });
                                result = result && atLeastOneEmail;
                                return result;
                            }
                        }
                        break;
                    case 'url':
                        value = matchingPaterns.urlStart.test(value) ? value : 'http://' + value;
                        break;
                    case 'equals':
                        $equalsElement = $($element.data("equals"));
                        pattern = {
                            test: function (value) {
                                return $equalsElement.val() === value;
                            }
                        }
                        result.message = formatMessage(result.message, $equalsElement.data('name'));
                        break;
                    default:
                        if (!pattern) {
                            pattern = /.*/;
                        }
                        break;
                }
                result.isValid = pattern.test(value);
                return result;
            },
            validation: function ($element, validationMethods, methodCount, originalEvent) {
                var value = $element.val(),
                    errorsList = [],
                    testResult,
                    event,
                    i, validationMethod;

                for (i = 0; i < methodCount; i++) {
                    validationMethod = validationMethods[i];
                    testResult = handle.testValue(validationMethods[i], value, $element);
                    if (!$element.is(':disabled') && !testResult.isValid) {
                        errorsList.push(testResult);
                    }
                    if (validationMethod === 'required' && !value) {
                        break;
                    }
                }
                if (errorsList.length) {
                    event = $.Event('invalid', {
                        errors: errorsList
                    });
                } else {
                    event = $.Event('valid');
                }
                $element.trigger(event);
            },
            areaValidation: function ($area) {
                var $inputs = $area.find('[data-validate], [custom-error]'),
                    isValid = true;

                $area.on('invalid.area-validation', function () {
                    isValid = false;
                });
                $inputs.each(function () {
                    $(this).trigger($.Event('validate'));
                });

                $area.off('invalid.area-validation');
                return isValid;
            },
            hideErrors: function ($area) {
                var $elements = $area.find('[data-validate], [custom-error]');

                $elements.tooltip('hide');
            },
            showErrors: function ($area) {
                var $elements = $area.find('[data-validate], [custom-error]');

                $elements.tooltip('show');
            },
            hideElementError: function ($element) {
                $element.trigger('valid');
            },
            invalidInput: function (event) {
                var $input = $(this),
                    errorsContainer = [];
                if (event.errors) {
                    for (var i = 0, errors = event.errors, length = errors.length; i < length; i++) {
                        errorsContainer.push('<div>' + errors[i].message + '</div>');
                    }

                    $input
                        .addClass('error')
                        .tooltip('destroy')
                        .tooltip({
                            title: errorsContainer.join(''),
                            className: 'error',
                            html: true,
                            trigger: 'manual',
                            animation: false,
                            container: $input.parent()
                        })
                        .tooltip('show');
                }
            },
            validInput: function (event) {
                var $input = $(this);

                $input
                    .removeClass('error')
                    .removeAttr('custom-error')
                    .tooltip('destroy');
            },
            addTestPattern: function (name, pattern) {
                if (name && pattern && pattern instanceof RegExp) {
                    matchingPaterns[name] = pattern;
                }
            },
            extendTestPattern: function(name, pattern) {
                if (name && pattern && pattern instanceof RegExp && matchingPaterns[name]) {
                    var flags = '';
                    if (matchingPaterns[name].ignoreCase && pattern.ignoreCase) {
                        flags += 'i';
                    }

                    if (matchingPaterns[name].global && pattern.global) {
                        flags += 'g';
                    }

                    if (matchingPaterns[name].multiline && pattern.multiline) {
                        flags += 'm';
                    }

                    var extended = new RegExp(matchingPaterns[name].source + '|' + pattern.source, flags);
                    matchingPaterns[name] = extended;
                }
            }
        };
    //Events delegation
    $(document)
        .on('change.validation.adform validate.validation.adform', '[data-validate]', handle.interaction)
        .on('invalid.validation.adform', '[data-validate], [custom-error], [data-error-redirect]', handle.invalidInput)
        .on('valid.validation.adform', '[data-validate], [custom-error], [data-error-redirect]', handle.validInput)
        .on('validate.validation.adform', '[custom-error]', handle.validInput)
        .on('hideError.validation.adform', '[data-validate], [custom-error]', handle.validInput);

    //Public API
    $.fn.validation = function (method) {
        switch (method) {
            case 'isValid':
                return handle.areaValidation(this);
            case 'error':
                handle.customError(this, arguments[1]);
                break;
            case 'valid':
                handle.hideElementError(this);
                break;
            case 'hide':
                handle.hideErrors(this);
                break;
            case 'show':
                handle.showErrors(this);
                break;
        }
    }
    $.validation = {
        setMessages: function (messagesObject) {
            $.extend(validationMessages, messagesObject);
        },
        handlers: handle
    }
})(jQuery);