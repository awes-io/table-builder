(function () {
    'use strict';

    var store = {

        state: {},

        mutations: {
            
            setData: (state, { param, data }) => {
                Vue.set(state, param, data);
            }
        }
    };

    const compare = (obj1, obj2, exclude) => {
        return _.isEqual(
            _.omit(obj1, exclude),
            _.omit(obj2, exclude)
        );
    };

    //First letter to upper case
    const ucFirst = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var config = {
        scrollTo: 'body', // CSS selector
        scrollDuration: 200, // ms
        mediaQueries: {
            mobile: '(max-width: 600px)',
            tablet: '(min-width: 601px) and (max-width: 900px)',
            desktop: '(min-width: 901px)'
        }
    };

    var mediaQueries = {

        props: {

            mediaQueries: {
                type: Object,
                default() {
                    return this._config.mediaQueries
                }
            }
        },


        data() {
            return {
                matchedMedia: []
            }
        },


        methods: {

            _getMediaName(media) {
                return Object.keys(this.mediaQueries).find(item => this.mediaQueries[item] === media)
            },

            _checkMediaMatch(mediaStr) {
                return mediaStr.split(',').some(media => {
                    return this.matchedMedia.includes(media.trim())
                })
            },

            onMatchMedia($event) {
                let name = this._getMediaName($event.media);
                let index = this.matchedMedia.indexOf(name);
                if ($event.matches && !~index) {
                    this.matchedMedia.push(name);
                }
                if (!$event.matches && ~index) {
                    this.matchedMedia.splice(index, 1);
                }
            }
        },


        beforeCreate() {
            this._config = Object.assign(config, _.pick(AWES._config.tableBuilder, Object.keys(config)));
        },


        beforeMount() {
            this._mq = {};
            for (let name in this.mediaQueries) {
                try {
                    this._mq[name] = window.matchMedia(this.mediaQueries[name]);
                    if (this._mq[name].matches) this.matchedMedia.push(name);
                    this._mq[name].addListener(this.onMatchMedia);
                } catch (error) {
                    console.log('Table builder: ', error);
                }
            }
        },


        beforeDestroy() {
            if (!this._mq) return
            for (let name in this._mq) {
                this._mq[name].removeListener(this.onMatchMedia);
            }
        }
    };

    //

    var script = {

        name: 'table-builder',

        mixins: [ mediaQueries ],


        props: {

            storeData: {
                type: String,
                required: true
            },

            default: [Array, Object],

            rowUrl: String
        },


        data() {
            return {
                activeItem: null
            }
        },


        computed: {

            tableData() {
                let fromStore = AWES._store.state[this.storeData];
                return fromStore && fromStore.length ? fromStore : false
            },

            isLoading() {
                return AWES._store.state[this.storeData + '_loading']
            },

            columns() {
                return this.$slots.default && this.$slots.default.filter( item => {
                    return item.componentOptions && item.componentOptions.tag === 'tb-column'
                })
            },

            hasColumns() {
                return this.columns && !! this.columns.length
            },

            tableOptions() {
                return this.columns && this.columns.map(item => {
                    return Object.assign({}, item.componentOptions.propsData, {
                        className: item.data.staticClass,
                        scopedSlots: item.data.scopedSlots && item.data.scopedSlots.default ?
                                     item.data.scopedSlots.default :
                                     null
                    });
                });
            },

            shownOptions() {
                return this.tableOptions && this.tableOptions.filter( item => {
                    if ( ! item.media || item.media && this._checkMediaMatch(item.media) ) return true
                })
            },

            hiddenOptions() {
                return this.tableOptions && this.tableOptions.filter( item => {
                    if ( item.media && ! this._checkMediaMatch(item.media) ) return true
                }).map( item => item.name )
            },

            hiddenColumnData() {
                if ( ! this.hiddenOptions || ! this.hiddenOptions.length || ! this.tableData ) return false
                return this.tableData.map( row => {
                    let hiddenData = {};
                    Object.keys(row)
                          .filter( key => this.hiddenOptions.includes(key) )
                          .forEach( key => { hiddenData[key] = row[key]; });
                    return hiddenData
                })
            },

            columnNames() {
                return this.shownOptions.map( item => {
                    return ucFirst( typeof item.label !== 'undefined' ?
                                           item.label :
                                           item.name )
                })
            },
        },


        watch: {

            hiddenColumnData( data ) {
                if ( data === false ) this.activeItem = null;
            }
        },


        methods: {

            setActiveItem(index, val) {
                if (val) {
                    this.activeItem = index;
                } else {
                    this.activeItem = null;
                }
            },
        },


        beforeCreate() {

            let dafault = this.$options.propsData.default;
            if ( ! dafault ) return;

            let defaultData = Array.isArray(dafault) ?
                              dafault.slice() :
                              [ Object.assign({}, this.$options.propsData.default) ];
            AWES._store.commit('setData', {
                param: this.$options.propsData.storeData,
                data: defaultData
            });
        }
    };

    function normalizeComponent(compiledTemplate, injectStyle, defaultExport, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, isShadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
        if (typeof isShadowMode === 'function') {
            createInjectorSSR = createInjector;
            createInjector = isShadowMode;
            isShadowMode = false;
        }
        // Vue.extend constructor export interop
        const options = typeof defaultExport === 'function' ? defaultExport.options : defaultExport;
        // render functions
        if (compiledTemplate && compiledTemplate.render) {
            options.render = compiledTemplate.render;
            options.staticRenderFns = compiledTemplate.staticRenderFns;
            options._compiled = true;
            // functional template
            if (isFunctionalTemplate) {
                options.functional = true;
            }
        }
        // scopedId
        if (scopeId) {
            options._scopeId = scopeId;
        }
        let hook;
        if (moduleIdentifier) {
            // server build
            hook = function (context) {
                // 2.3 injection
                context =
                    context || // cached call
                        (this.$vnode && this.$vnode.ssrContext) || // stateful
                        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
                // 2.2 with runInNewContext: true
                if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                    context = __VUE_SSR_CONTEXT__;
                }
                // inject component styles
                if (injectStyle) {
                    injectStyle.call(this, createInjectorSSR(context));
                }
                // register component module identifier for async chunk inference
                if (context && context._registeredComponents) {
                    context._registeredComponents.add(moduleIdentifier);
                }
            };
            // used by ssr in case component is cached and beforeCreate
            // never gets called
            options._ssrRegister = hook;
        }
        else if (injectStyle) {
            hook = isShadowMode
                ? function () {
                    injectStyle.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
                }
                : function (context) {
                    injectStyle.call(this, createInjector(context));
                };
        }
        if (hook) {
            if (options.functional) {
                // register for functional component in vue file
                const originalRender = options.render;
                options.render = function renderWithStyleInjection(h, context) {
                    hook.call(context);
                    return originalRender(h, context);
                };
            }
            else {
                // inject component registration as beforeCreate hook
                const existing = options.beforeCreate;
                options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
            }
        }
        return defaultExport;
    }

    /* script */
    const __vue_script__ = script;
    // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
    script.__file = "/home/illjah/awescode/table-builder/resources/vue/table-builder.vue";

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "int-table",
          class: {
            "is-loading": _vm.isLoading,
            "is-empty": !_vm.tableData && !_vm.isLoading
          }
        },
        [
          _vm._t("header"),
          _vm._v(" "),
          !_vm.tableData && !_vm.isLoading
            ? _c(
                "div",
                { staticClass: "int-table__no-data" },
                [
                  _vm._t("empty", [
                    _vm._v(
                      "\n            " +
                        _vm._s(_vm.$lang.TABLE_NO_DATA) +
                        "\n        "
                    )
                  ])
                ],
                2
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.isLoading
            ? _c(
                "div",
                { staticClass: "int-table__loader" },
                [
                  _vm._t("loader", [
                    _vm._v(
                      "\n            " +
                        _vm._s(_vm.$lang.TABLE_LOADING) +
                        "\n        "
                    )
                  ])
                ],
                2
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.tableData && !_vm.hasColumns
            ? _c(
                "div",
                { staticClass: "int-table__list" },
                _vm._l(_vm.tableData, function(row, i) {
                  return _c(
                    "div",
                    { key: i, staticClass: "int-table__list-row" },
                    [
                      _vm._t(
                        "list",
                        [
                          typeof row === "object"
                            ? _vm._l(row, function(item, key) {
                                return _c(
                                  "div",
                                  { key: key, staticClass: "int-table__list-cell" },
                                  [
                                    _c(
                                      "span",
                                      { staticClass: "int-table__list-name" },
                                      [_vm._v(_vm._s(key) + " : ")]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "span",
                                      { staticClass: "int-table__list-value" },
                                      [_vm._v(_vm._s(item))]
                                    )
                                  ]
                                )
                              })
                            : [
                                _vm._v(
                                  "\n                    " +
                                    _vm._s(row) +
                                    "\n                "
                                )
                              ]
                        ],
                        { tableData: _vm.tableData, data: row, index: i }
                      )
                    ],
                    2
                  )
                }),
                0
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.tableData && _vm.hasColumns
            ? _c("table", { staticClass: "int-table__table" }, [
                _c("thead", [
                  _c(
                    "tr",
                    _vm._l(_vm.columnNames, function(name, i) {
                      return _c("th", { key: i }, [_vm._v(_vm._s(name))])
                    }),
                    0
                  )
                ]),
                _vm._v(" "),
                _c(
                  "tbody",
                  [
                    _vm._l(_vm.tableData, function(rowData, i) {
                      return [
                        _c("tb-row", {
                          key: i + "-row",
                          attrs: {
                            tableOptions: _vm.shownOptions,
                            data: rowData,
                            index: i,
                            active: _vm.activeItem === i,
                            url: _vm.rowUrl,
                            matchedMedia: _vm.matchedMedia,
                            showToggler: !!_vm.hiddenColumnData
                          },
                          on: { setActive: _vm.setActiveItem }
                        }),
                        _vm._v(" "),
                        _vm.hiddenColumnData
                          ? _c(
                              "tr",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: _vm.activeItem === i,
                                    expression: "activeItem === i"
                                  }
                                ],
                                key: i + "-hidden-row",
                                staticClass: "int-table__hidden"
                              },
                              [
                                _c(
                                  "td",
                                  {
                                    attrs: { colspan: _vm.shownOptions.length + 1 }
                                  },
                                  [
                                    _vm._t(
                                      "hidden",
                                      [
                                        _c(
                                          "ul",
                                          _vm._l(_vm.hiddenColumnData[i], function(
                                            option,
                                            j
                                          ) {
                                            return _c(
                                              "li",
                                              { key: j + "-hidden" },
                                              [
                                                _vm._v(
                                                  "\n                                    " +
                                                    _vm._s(option) +
                                                    "\n                                "
                                                )
                                              ]
                                            )
                                          }),
                                          0
                                        )
                                      ],
                                      {
                                        rowData: rowData,
                                        data: _vm.hiddenColumnData[i],
                                        matchedMedia: _vm.matchedMedia,
                                        index: i
                                      }
                                    )
                                  ],
                                  2
                                )
                              ]
                            )
                          : _vm._e()
                      ]
                    })
                  ],
                  2
                )
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm._t("footer")
        ],
        2
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = undefined;
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var tableBuilder = normalizeComponent(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        undefined,
        undefined
      );

    var script$1 = {

        name: 'tb-row',

        props: {

            data: {
                type: Object,
                required: true
            },

            tableOptions: {
                type: Array,
                required: true
            },

            index: {
                type: Number,
                required: true
            },

            active: {
                type: Boolean,
                default: false
            },

            url: String,

            matchedMedia: Array,

            showToggler: {
                type: Boolean,
                default: false
            }
        },


        computed: {

            urlFormatted() {
                let url = this.url;
                let props = url.match(/(?!{)([\w.\[\]]+)(?=})/g);
                props && props.length && props.forEach( prop => {
                    url = url.replace('{' + prop + '}', this.data[prop] || '');
                });
                return url.replace(/([^:]\/)\/+/g, '$1')
            }
        },


        methods: {

            getCell(data, option) {
                return option.scopedSlots ?
                        option.scopedSlots({
                            data: data,
                            index: this.index,
                            active: this.active,
                            matchedMedia: this.matchedMedia
                        }) :
                        this.data[option.name]
            },

            setActive(event) {
                event.preventDefault();
                event.stopPropagation();
                this.$emit('setActive', this.index, !this.active);
            },

            goTo() {
                if ( ! this.url ) return
                window.location.href = this.urlFormatted;
            }
        },


        render(h) {
            return h('tr', {
                    class: { active: this.active, 'int-table__block': true, 'is-link': this.url },
                    on: { click: this.goTo }
                }, [
                    this.tableOptions.map(option => {
                        return h('td', {class: [option.className]}, this.getCell(this.data, option))
                    }),
                    //Mobile toggle button
                    this.showToggler ? h('td', {
                        on:{ click: this.setActive},
                        attrs: {class: 'int-table__control-tab'}
                    }, [
                        h('a', {attrs: {class:'int-table__show', href: ''}}, [
                            h('i', {attrs: {class:'icon icon-box-down'}})
                        ])
                    ]) : null
                ]
            )
        }
    };

    /* script */
    const __vue_script__$1 = script$1;
    // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
    script$1.__file = "/home/illjah/awescode/table-builder/resources/vue/tb-row.vue";

    /* template */

      /* style */
      const __vue_inject_styles__$1 = undefined;
      /* scoped */
      const __vue_scope_id__$1 = undefined;
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = undefined;
      /* style inject */
      
      /* style inject SSR */
      

      
      var tbRow = normalizeComponent(
        {},
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        undefined,
        undefined
      );

    var script$2 = {

        name: 'tb-column',

        props: {

            name: String,

            label: String,

            media: String
        }
    };

    /* script */
    const __vue_script__$2 = script$2;
    // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
    script$2.__file = "/home/illjah/awescode/table-builder/resources/vue/tb-column.vue";

    /* template */

      /* style */
      const __vue_inject_styles__$2 = undefined;
      /* scoped */
      const __vue_scope_id__$2 = undefined;
      /* module identifier */
      const __vue_module_identifier__$2 = undefined;
      /* functional template */
      const __vue_is_functional_template__$2 = undefined;
      /* style inject */
      
      /* style inject SSR */
      

      
      var tbColumn = normalizeComponent(
        {},
        __vue_inject_styles__$2,
        __vue_script__$2,
        __vue_scope_id__$2,
        __vue_is_functional_template__$2,
        __vue_module_identifier__$2,
        undefined,
        undefined
      );

    //

    var script$3 = {

        name: 'paginate-builder',

        props: {

            default: {
                type: [Object, Array, Boolean],
                default: false
            },

            url: {
                type: String,
                required: true
            },

            storeData: {
                type: String,
                required: true
            },

            scrollTo: {
                type: [String, Boolean],
                default() {
                    return this._config.scrollTo
                }
            }
        },


        data() {
            return {
                serverData: {}
            }
        },


        computed: {

            meta() {
                return this.serverData ? this.serverData.meta : false
            },

            hasData() {
                let d = this.serverData;
                return d && d.data && Array.isArray(d.data) ? d.data.length : Object.keys(d.data).length
            },

            isLoading() {
                return AWES._store.state[this.storeData + '_loading']
            },

            paginate: function() {
                if ( ! this.meta ) return null;
                let offset = 2;
                //Если выводится одна страница, то нумерацию не показываем
                if (this.meta.last_page < 2) {
                    return false;
                }
                //Усли не более 7 страниц, используем простую пагинацию
                if (this.meta.last_page <= 7) {
                    return Array(this.meta.last_page).fill().map((_, idx) => idx + 1);
                }
                //Исходные данные
                let pagesArray = [1];
                let from = this.meta.current_page - offset;
                let to = this.meta.current_page + offset;

                //Нумерация
                if (from <= 1) {
                    from = 2;
                    to = offset*3;
                }
                else if ( to >= this.meta.last_page ) {
                    to = this.meta.last_page - 1;
                    from = this.meta.last_page - offset*3 + 1;
                }

                //Набираем массив
                for (let i = from; i <= to; i++) {
                    //Проверяем показывать цифру или же диапазон пропускаемых значений
                    if ( (i === from || i === to) && (i !== 2 && i !== (this.meta.last_page - 1))) {
                        pagesArray.push(false);
                    } else {
                        pagesArray.push(i);
                    }

                }

                //Добавим последнюю страницу
                pagesArray.push(this.meta.last_page);
                //Отдаем массив
                return pagesArray;
            },

            scrollElement() {
                return this.scrollTo && this._isMounted && document.querySelector(this.scrollTo)
            }
        },


        watch: {

            // в случае изменения маршрута запрашиваем данные вновь
            '$route': 'updateData',

            serverData: function () {
                AWES._store.commit('setData', {
                    param: this.storeData,
                    data: this.serverData.data
                });
            }
        },


        methods: {

            updateData(newParam, oldParam) {
                if ( oldParam && _.isEqual(oldParam.query, newParam.query) ) return
                let params = this.$route.query;
                if ( oldParam && !compare(oldParam.query, newParam.query, ['page']) && params['page'] != 1) {
                    this.setPage(1);
                } else {
                    this.fetchData(params);
                }
            },

            fetchData(params) {
                AWES.on('core:ajax', this.setLoader);
                AWES.ajax(params, this.url, 'get')
                    .then( res => {
                        this.serverData = res.data;
                        this.scrollElement && this.$SmoothScroll(this.scrollElement, this._config.scrollDuration);
                    })
                    .catch( e => {
                        console.log(e);
                    })
                    .finally(() => {
                        AWES.off('core:ajax', this.setLoader);
                    });
            },

            setLoader($event) {
                AWES._store.commit('setData', {
                    param: this.storeData + '_loading',
                    data: $event.detail
                });
            },

            update() {
                this.updateData();
            },

            setPage(page) {
                if (page > 0 && page <= this.meta.last_page) {
                    this.$router.push({
                        query: Object.assign({}, this.$route.query, { page: page.toString() })
                    });
                }
            }
        },


        beforeCreate() {
            // router
            this._routerRoot = this;
            this._router = AWES._vueRouter;
            this._router.init(this);
            Vue.util.defineReactive(this, '_route', this._router.history.current);

            // config
            this._config = Object.assign(config, _.pick(AWES._config.tableBuilder, Object.keys(config)));
        },


        created() {
            //Если данные не переданы в компонент, забираем с севера
            if ( this.default === false) {
                this.updateData();
            } else {
                this.serverData = this.default;
            }
        }
    };

    /* script */
    const __vue_script__$3 = script$3;
    // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
    script$3.__file = "/home/illjah/awescode/table-builder/resources/vue/paginate-builder.vue";

    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _vm.meta && _vm.hasData
        ? _c(
            "div",
            { staticClass: "pager", class: { "is-loading": _vm.isLoading } },
            [
              _c("span", { staticClass: "pager__caption" }, [
                _vm._v(
                  "Record " +
                    _vm._s(_vm.meta.from) +
                    "-" +
                    _vm._s(_vm.meta.to) +
                    " of " +
                    _vm._s(_vm.meta.total)
                )
              ]),
              _vm._v(" "),
              _vm.paginate
                ? _c("div", { staticClass: "pager__middle" }, [
                    _c("div", { staticClass: "pager__links" }, [
                      _c(
                        "a",
                        {
                          staticClass: "pager__arr-left",
                          attrs: { href: "" },
                          on: {
                            click: function($event) {
                              $event.preventDefault();
                              _vm.setPage(_vm.meta.current_page - 1);
                            }
                          }
                        },
                        [_c("i", { staticClass: "icon icon-arrow-left" })]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "pager__links-wrap" },
                        _vm._l(_vm.paginate, function(p, i) {
                          return _c("span", { key: i }, [
                            p
                              ? _c(
                                  "a",
                                  {
                                    staticClass: "pager__link",
                                    class: {
                                      pager__link_active:
                                        p === _vm.meta.current_page
                                    },
                                    attrs: { href: "" },
                                    on: {
                                      click: function($event) {
                                        $event.preventDefault();
                                        _vm.setPage(p);
                                      }
                                    }
                                  },
                                  [_vm._v(_vm._s(p))]
                                )
                              : _c("span", { staticClass: "pager__spacer" }, [
                                  _vm._v("...")
                                ])
                          ])
                        }),
                        0
                      ),
                      _vm._v(" "),
                      _c(
                        "a",
                        {
                          staticClass: "pager__arr-right",
                          attrs: { href: "" },
                          on: {
                            click: function($event) {
                              $event.preventDefault();
                              _vm.setPage(_vm.meta.current_page + 1);
                            }
                          }
                        },
                        [_c("i", { staticClass: "icon icon-arrow-right" })]
                      )
                    ])
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "pager__shows" },
                [
                  _c(
                    "context-menu",
                    { attrs: { top: "" } },
                    [
                      _c("template", { slot: "toggler" }, [
                        _c("span", { staticClass: "pager__shows-link" }, [
                          _vm._v(_vm._s(_vm.meta.per_page))
                        ])
                      ]),
                      _vm._v(" "),
                      _c("cm-query", { attrs: { param: { limit: "" } } }, [
                        _vm._v("10")
                      ]),
                      _vm._v(" "),
                      _c("cm-query", { attrs: { param: { limit: 50 } } }, [
                        _vm._v("50")
                      ]),
                      _vm._v(" "),
                      _c("cm-query", { attrs: { param: { limit: 100 } } }, [
                        _vm._v("100")
                      ])
                    ],
                    2
                  )
                ],
                1
              )
            ]
          )
        : _vm._e()
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$3 = undefined;
      /* scoped */
      const __vue_scope_id__$3 = undefined;
      /* module identifier */
      const __vue_module_identifier__$3 = undefined;
      /* functional template */
      const __vue_is_functional_template__$3 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var paginateBuilder = normalizeComponent(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$3,
        __vue_script__$3,
        __vue_scope_id__$3,
        __vue_is_functional_template__$3,
        __vue_module_identifier__$3,
        undefined,
        undefined
      );

    function install(Vue) {

        if ( this.installed ) return
        this.installed = true;

        Vue.component('table-builder', tableBuilder);
        Vue.component('tb-row', tbRow);
        Vue.component('tb-column', tbColumn);
        Vue.component('paginate-builder', paginateBuilder);
    }

    var plugin = {

        installed: false,

        install
    };

    var lang = {
        TABLE_NO_DATA: 'No data, check the connection quality',
        TABLE_LOADING: 'Loading...'
    };

    const awesPlugin = {

        modules: {
            'vue': {
                src: 'https://unpkg.com/vue@2.5.21/dist/vue.js',
                cb() {
                    Vue.use(plugin);
                }
            },
            'vue-router': {
                src: 'https://unpkg.com/vue-router@3.0.2/dist/vue-router.min.js',
                deps: ['vue'],
                cb() {
                    AWES._vueRouter = AWES._vueRouter || new VueRouter({ mode: 'history' });
                }
            },
            'vue-smoothscroll': {
                src: 'https://unpkg.com/vue-smoothscroll@0.2.0/dist/vue-smoothscroll.js',
                deps: ['vue'],
                cb() {
                    Vue.use(VueSmoothScroll);
                }
            },
            'lodash': {
                src: 'https://unpkg.com/lodash@4.17.11/lodash.min.js',
                deps: ['vue'],
                cb() {
                    Vue.prototype.$get = _.get;
                }
            },
            'vuex': {
                src: 'https://unpkg.com/vuex@2.5.0/dist/vuex.min.js',
                deps: ['vue'],
                cb() {
                    AWES._store = AWES._store || new Vuex.Store(store);
                }
            },
            'awes-context-menu': {
                src: 'https://storage.awes.io/680a7d07f89b94e7fc83be657a2daa27/awes-io/context-menu/v0.x.x/js/main.js',
            }
        },

        install() {
            AWES.lang = lang;
        }
    };

    if (window && ('AWES' in window)) {
        AWES.use(awesPlugin);
    } else {
        window.__awes_plugins_stack__ = window.__awes_plugins_stack__ || [];
        window.__awes_plugins_stack__.push(awesPlugin);
    }

}());
