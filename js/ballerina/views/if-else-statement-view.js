/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
define(['require', 'lodash', 'log', './ballerina-statement-view', './../ast/if-else-statement', 'd3utils', 'd3'],
    function (require, _, log, BallerinaStatementView, IfElseStatement, D3Utils, d3) {

        /**
         * The view to represent a If Else statement which is an AST visitor.
         * @param {Object} args - Arguments for creating the view.
         * @param {IfElseStatement} args.model - The If Else statement model.
         * @param {Object} args.container - The HTML container to which the view should be added to.
         * @param {Object} args.parent - Parent View (Resource, Worker, etc)
         * @param {Object} [args.viewOptions={}] - Configuration values for the view.
         * @constructor
         */
        var IfElseStatementView = function (args) {
            this._model = _.get(args, "model");
            this._container = _.get(args, "container");
            this._viewOptions = _.get(args, "viewOptions", {});
            this._ifBlockView = undefined;
            this._elseBlockView = undefined;

            if (_.isNil(this._model) || !(this._model instanceof IfElseStatement)) {
                log.error("If Else statement definition is undefined or is of different type." + this._model);
                throw "If Else statement definition is undefined or is of different type." + this._model;
            }

            if (_.isNil(this._container)) {
                log.error("Container for If Else statement is undefined." + this._container);
                throw "Container for If Else statement is undefined." + this._container;
            }

            BallerinaStatementView.call(this);
        };

        IfElseStatementView.prototype = Object.create(BallerinaStatementView.prototype);
        IfElseStatementView.prototype.constructor = IfElseStatementView;

        IfElseStatementView.prototype.canVisitStatement = function(){
            return true;
        };

        /**
         * Visit If Statement
         * @param {IfStatement} statement
         */
        IfElseStatementView.prototype.visitIfStatement = function(statement){
            var StatementViewFactory = require('./statement-view-factory');
            var statementViewFactory = new StatementViewFactory();
            var args = {model: statement, container: this.getStatementGroup(), viewOptions: undefined, parent: this};
            var statementView = statementViewFactory.getStatementView(args);
            this._ifBlockView = statementView;
            statementView.render();
        };

        /**
         * Visit Else Statement
         * @param {ElseStatement} statement
         */
        IfElseStatementView.prototype.visitElseStatement = function(statement){
            var StatementViewFactory = require('./statement-view-factory');
            var statementViewFactory = new StatementViewFactory();
            var args = {model: statement, container: this.getStatementGroup(), viewOptions: undefined, parent: this};
            var statementView = statementViewFactory.getStatementView(args);
            this._elseBlockView = statementView;
            statementView.render();
        };

        /**
         * Render the svg group to draw the if and the else statements
         */
        IfElseStatementView.prototype.render = function () {
            var ifElseGroup = D3Utils.group(d3.select(this._container));
            this.setStatementGroup(ifElseGroup);
            this._model.accept(this);
        };

        /**
         * Set the IfElseStatement model
         * @param {IfElseStatement} model
         */
        IfElseStatementView.prototype.setModel = function (model) {
            if (!_.isNil(model) && model instanceof IfElseStatement) {
                this._model = model;
            } else {
                log.error("If Else statement definition is undefined or is of different type." + model);
                throw "If Else statement definition is undefined or is of different type." + model;
            }
        };

        /**
         * Set the container to draw the if else group
         * @param container
         */
        IfElseStatementView.prototype.setContainer = function (container) {
            if (!_.isNil(container)) {
                this._container = container;
            } else {
                log.error("Container for If Else statement is undefined." + container);
                throw "Container for If Else statement is undefined." + container;
            }
        };

        IfElseStatementView.prototype.setViewOptions = function (viewOptions) {
            this._viewOptions = viewOptions;
        };

        /**
         * @returns {_model}
         */
        IfElseStatementView.prototype.getModel = function () {
            return this._model;
        };

        IfElseStatementView.prototype.getContainer = function () {
            return this._container;
        };

        IfElseStatementView.prototype.getViewOptions = function () {
            return this._viewOptions;
        };

        IfElseStatementView.prototype.setIfBlockView = function (ifBlockView) {
            this._ifBlockView = ifBlockView;
        };

        IfElseStatementView.prototype.setElseBlockView = function (elseBlockView) {
            this._elseBlockView = elseBlockView;
        };

        IfElseStatementView.prototype.getIfBlockView = function () {
            return this._ifBlockView;
        };

        IfElseStatementView.prototype.getElseBlockView = function () {
            return this._elseBlockView;
        };

        return IfElseStatementView;
    });