angular.module("biigle.label-trees",["biigle.api","biigle.ui"]),angular.module("biigle.label-trees").config(["$compileProvider",function(e){"use strict";e.debugInfoEnabled(!1)}]),biigle.$viewModel("label-trees-labels",function(e){var t=biigle.$require("api.labels"),l=biigle.$require("messages.store"),i=biigle.$require("labelTrees.randomColor"),n=biigle.$require("labelTrees.labelTree");new Vue({el:e,data:{editing:!1,loading:!1,labels:biigle.$require("labelTrees.labels"),selectedColor:i(),selectedLabel:null,selectedName:""},components:{typeahead:VueStrap.typeahead,tabs:VueStrap.tabs,tab:VueStrap.tab,labelTree:biigle.$require("labelTrees.components.labelTree"),manualLabelForm:biigle.$require("labelTrees.components.manualLabelForm"),wormsLabelForm:biigle.$require("labelTrees.components.wormsLabelForm")},computed:{classObject:function(){return{"panel-warning":this.editing}}},methods:{toggleEditing:function(){this.editing=!this.editing},startLoading:function(){this.loading=!0},finishLoading:function(){this.loading=!1},deleteLabel:function(e){var i=this;this.startLoading(),t.delete({id:e.id}).then(function(){i.labelDeleted(e)},l.handleErrorResponse).finally(this.finishLoading)},labelDeleted:function(e){this.selectedLabel&&this.selectedLabel.id===e.id&&this.deselectLabel(e);for(var t=this.labels.length-1;t>=0;t--)if(this.labels[t].id===e.id){this.labels.splice(t,1);break}},selectLabel:function(e){this.selectedLabel=e,e?(this.selectedColor="#"+e.color,this.$emit("select",e)):this.$emit("clear")},deselectLabel:function(e){this.selectedLabel=null,this.$emit("deselect",e)},selectColor:function(e){this.selectedColor=e},selectName:function(e){this.selectedName=e},insertLabel:function(e){Vue.set(e,"open",!1),Vue.set(e,"selected",!1);for(var t=e.name.toLowerCase(),l=0,i=this.labels.length;l<i;l++)if(this.labels[l].name.toLowerCase()>=t)return void this.labels.splice(l,0,e);this.labels.push(e)},createLabel:function(e){this.loading||(this.startLoading(),t.save({label_tree_id:n.id},e).then(this.labelCreated,l.handleErrorResponse).finally(this.finishLoading))},labelCreated:function(e){e.data.forEach(this.insertLabel),this.selectedColor=i(),this.selectedName=""}}})}),biigle.$declare("labelTrees.randomColor",function(){var e=[0,.5,.9],t=[360,1,1],l=[0,2,2],i=function(e){var t,l=e[0]/60,i=Math.floor(l),n=l-i,a=[e[2]*(1-e[1]),e[2]*(1-e[1]*n),e[2]*(1-e[1]*(1-n))];switch(i){case 1:t=[a[1],e[2],a[0]];break;case 2:t=[a[0],e[2],a[2]];break;case 3:t=[a[0],a[1],e[2]];break;case 4:t=[a[2],a[0],e[2]];break;case 5:t=[e[2],a[0],a[1]];break;default:t=[e[2],a[2],a[0]]}return t.map(function(e){return Math.round(255*e)})},n=function(e){return e.map(function(e){return e=e.toString(16),1===e.length?"0"+e:e})};return function(){for(var a,r=[0,0,0],s=r.length-1;s>=0;s--)a=10*l[s],r[s]=(t[s]-e[s])*Math.random()+e[s],0!==a?r[s]=Math.round(r[s]*a)/a:r[s]=Math.round(r[s]);return"#"+n(i(r)).join("")}}),angular.module("biigle.label-trees").controller("AuthorizedProjectsController",["$scope","LABEL_TREE","AUTH_PROJECTS","AUTH_OWN_PROJECTS","Project","LabelTreeAuthorizedProject",function(e,t,l,i,n,a){"use strict";var r=!1,s=!1,o=null,c=null,u=function(e){for(var t=l.length-1;t>=0;t--)if(l[t].id===e.id)return!1;return!0},d=function(e){c=e.filter(u)},b=function(e){msg.responseError(e),s=!1},h=function(e){l.push(e),i.push(e.id),d(o),s=!1},p=function(e){var t;for(t=l.length-1;t>=0;t--)if(l[t].id===e.id){l.splice(t,1);break}t=i.indexOf(e.id),t!==-1&&i.splice(t,1),d(o),s=!1};e.hasProjects=function(){return l.length>0},e.getProjects=function(){return l},e.isOwnProject=function(e){return i.indexOf(e.id)!==-1},e.isEditing=function(){return r},e.getVisibilityId=function(){return t.visibility_id},e.toggleEditing=function(){o||(o=n.query(d)),r=!r},e.isLoading=function(){return s},e.getProjectsForAuthorization=function(){return c},e.addAuthorizedProject=function(e){s=!0,a.addAuthorized({id:t.id},{id:e.id},function(){h(e)},b)},e.removeAuthorizedProject=function(e){s=!0,a.removeAuthorized({id:t.id},{id:e.id},function(){p(e)},b)}}]),angular.module("biigle.label-trees").controller("LabelTreeController",["$scope","LABEL_TREE","LabelTree","msg","$timeout","LabelTreeUser","USER_ID","REDIRECT_URL",function(e,t,l,i,n,a,r,s){"use strict";var o=!1,c=!1;e.labelTreeInfo={name:t.name,description:t.description,visibility_id:t.visibility_id.toString()};var u=function(e){i.responseError(e),c=!1},d=function(e){t.name=e.name,t.description=e.description,t.visibility_id=parseInt(e.visibility_id),o=!1,c=!1},b=function(){i.success("The label tree was deleted. Redirecting..."),n(function(){window.location.href=s},2e3)},h=function(e){e?(i.success("You left the label tree. Redirecting..."),n(function(){window.location.href=s},2e3)):(i.success("You left the label tree. Reloading..."),n(function(){window.location.reload()},2e3))};e.isEditing=function(){return o},e.toggleEditing=function(){o=!o},e.isSaving=function(){return c},e.getVisibilityId=function(){return t.visibility_id},e.getName=function(){return t.name},e.getDescription=function(){return t.description},e.saveChanges=function(){c=!0,l.update({id:t.id,name:e.labelTreeInfo.name,description:e.labelTreeInfo.description,visibility_id:parseInt(e.labelTreeInfo.visibility_id)},d,u)},e.discardChanges=function(){e.labelTreeInfo.name=t.name,e.labelTreeInfo.description=t.description,e.labelTreeInfo.visibility_id=t.visibility_id.toString(),o=!1},e.deleteTree=function(){confirm("Do you really want to delete the label tree "+t.name+"?")&&l.delete({id:t.id},b,i.responseError)},e.leaveTree=function(e){confirm("Do you really want to leave the label tree "+t.name+"?")&&a.detach({label_tree_id:t.id},{id:r},function(){h(e)},i.responseError)}}]),angular.module("biigle.label-trees").controller("MembersController",["$scope","LABEL_TREE","MEMBERS","ROLES","DEFAULT_ROLE_ID","USER_ID","LabelTreeUser","msg","User",function(e,t,l,i,n,a,r,s,o){"use strict";var c=!1,u=!1;e.newMember={user:null,role_id:n.toString()};var d=function(e){s.responseError(e),u=!1},b=function(e){e.role_id=parseInt(e.tmp_role_id),u=!1},h=function(e,t){e.tmp_role_id=e.role_id.toString(),d(t)},p=function(e){for(var t=l.length-1;t>=0;t--)if(l[t].id===e.id){l.splice(t,1);break}u=!1},f=function(e){for(var t=l.length-1;t>=0;t--)if(l[t].id===e.id)return!1;return!0},m=function(e){return e.filter(f)},g=function(t){t.tmp_role_id=t.role_id.toString(),l.push(t),e.newMember.user=null,u=!1};e.isEditing=function(){return c},e.toggleEditing=function(){c=!c},e.isLoading=function(){return u},e.getMembers=function(){return l},e.hasMembers=function(){return l.length>0},e.getRoles=function(){return i},e.getRole=function(e){return i[e]},e.isOwnUser=function(e){return a===e.id},e.updateRole=function(e){u=!0,r.update({label_tree_id:t.id},{id:e.id,role_id:parseInt(e.tmp_role_id)},function(){b(e)},function(t){h(e,t)})},e.detachMember=function(e){u=!0,r.detach({label_tree_id:t.id},{id:e.id},function(){p(e)},d)},e.username=function(e){return e&&e.firstname&&e.lastname?e.firstname+" "+e.lastname:""},e.findUser=function(e){return o.find({query:encodeURIComponent(e)}).$promise.then(m)},e.newMemberValid=function(){return e.newMember.user&&void 0!==e.newMember.user.id&&f(e.newMember.user)&&null!==e.newMember.role_id},e.attachMember=function(){if(e.newMemberValid()){u=!0;var l=e.newMember.user;l.role_id=parseInt(e.newMember.role_id),r.attach({label_tree_id:t.id},{id:l.id,role_id:l.role_id},function(){g(l)},d)}};for(var v=l.length-1;v>=0;v--)l[v].tmp_role_id=l[v].role_id.toString()}]),biigle.$declare("api.labelSource",Vue.resource("/api/v1/label-sources{/id}/find")),biigle.$declare("api.labels",Vue.resource("/api/v1/labels{/id}",{},{save:{method:"POST",url:"/api/v1/label-trees{/label_tree_id}/labels"}})),biigle.$component("labelTrees.components.labelTree",{template:'<div class="label-tree"><h4 class="label-tree__title" v-if="showTitle"><button v-if="collapsible" @click.stop="collapse" class="btn btn-default btn-xs pull-right" :title="collapseTitle"><span v-if="collapsed" class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span><span v-else class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></button>{{name}}</h4><ul v-if="!collapsed" class="label-tree__list"><label-tree-label :label="label" :deletable="deletable" v-for="label in rootLabels" @select="emitSelect" @deselect="emitDeselect" @delete="emitDelete"></label-tree-label></ul></div>',data:function(){return{collapsed:!1}},components:{labelTreeLabel:biigle.$require("labelTrees.components.labelTreeLabel")},props:{name:{type:String,required:!0},labels:{type:Array,required:!0},showTitle:{type:Boolean,default:!0},standalone:{type:Boolean,default:!1},collapsible:{type:Boolean,default:!0},multiselect:{type:Boolean,default:!1},deletable:{type:Boolean,default:!1}},computed:{labelMap:function(){for(var e={},t=this.labels.length-1;t>=0;t--)e[this.labels[t].id]=this.labels[t];return e},compiledLabels:function(){for(var e,t={},l=0,i=this.labels.length;l<i;l++)e=this.labels[l].parent_id,t.hasOwnProperty(e)?t[e].push(this.labels[l]):t[e]=[this.labels[l]];for(l=this.labels.length-1;l>=0;l--)t.hasOwnProperty(this.labels[l].id)?Vue.set(this.labels[l],"children",t[this.labels[l].id]):(Vue.set(this.labels[l],"children",void 0),this.labels[l].open=!1);return t},rootLabels:function(){return this.compiledLabels[null]},collapseTitle:function(){return this.collapsed?"Expand":"Collapse"}},methods:{hasLabel:function(e){return this.labelMap.hasOwnProperty(e)},getLabel:function(e){return this.labelMap[e]},getParents:function(e){for(var t=[];null!==e.parent_id;)e=this.getLabel(e.parent_id),t.unshift(e.id);return t},emitSelect:function(e){this.$emit("select",e)},emitDeselect:function(e){this.$emit("deselect",e)},emitDelete:function(e){this.$emit("delete",e)},selectLabel:function(e){if(this.multiselect||this.clearSelectedLabels(),this.hasLabel(e.id)){e.selected=!0,this.collapsed=!1;for(var t=this.getParents(e),l=t.length-1;l>=0;l--)this.getLabel(t[l]).open=!0}},deselectLabel:function(e){this.hasLabel(e.id)&&(e.selected=!1)},clearSelectedLabels:function(){for(var e=this.labels.length-1;e>=0;e--)this.labels[e].selected=!1},collapse:function(){this.collapsed=!this.collapsed}},created:function(){for(i=this.labels.length-1;i>=0;i--)Vue.set(this.labels[i],"open",!1),Vue.set(this.labels[i],"selected",!1);this.standalone?(this.$on("select",this.selectLabel),this.$on("deselect",this.deselectLabel)):(this.$parent.$on("select",this.selectLabel),this.$parent.$on("deselect",this.deselectLabel),this.$parent.$on("clear",this.clearSelectedLabels))}}),biigle.$component("labelTrees.components.labelTreeLabel",{name:"label-tree-label",template:'<li class="label-tree-label cf" :class="classObject"><div class="label-tree-label__name" @click="toggleOpen"><span class="label-tree-label__color" :style="colorStyle"></span><span v-text="label.name" @click.stop="toggleSelect"></span><span v-if="showFavourite" class="label-tree-label__favourite" @click.stop="toggleFavourite"><span class="glyphicon" :class="favouriteClass" aria-hidden="true" title=""></span></span><button v-if="deletable" type="button" class="close label-tree-label__delete" :title="deleteTitle" @click.stop="deleteThis"><span aria-hidden="true">&times;</span></button></div><ul v-if="label.open" class="label-tree__list"><label-tree-label :label="child" :deletable="deletable" v-for="child in label.children" @select="emitSelect" @deselect="emitDeselect" @delete="emitDelete"></label-tree-label></ul></li>',data:function(){return{favourite:!1}},props:{label:{type:Object,required:!0},showFavourite:{type:Boolean,required:!1},deletable:{type:Boolean,default:!1}},computed:{classObject:function(){return{"label-tree-label--selected":this.label.selected,"label-tree-label--expandable":this.label.children}},colorStyle:function(){return{"background-color":"#"+this.label.color}},favouriteClass:function(){return{"glyphicon-star-empty":!this.favourite,"glyphicon-star":this.favourite}},deleteTitle:function(){return"Remove label "+this.label.name}},methods:{toggleSelect:function(){this.label.selected?this.$emit("deselect",this.label):this.$emit("select",this.label)},deleteThis:function(){this.emitDelete(this.label)},toggleOpen:function(){this.label.children?this.label.open=!this.label.open:this.toggleSelect()},toggleFavourite:function(){this.favourite=!this.favourite},emitSelect:function(e){this.$emit("select",e)},emitDeselect:function(e){this.$emit("deselect",e)},emitDelete:function(e){this.$emit("delete",e)}}}),biigle.$component("labelTrees.components.labelTrees",{template:'<div class="label-trees"><div v-if="typeahead || clearable" class="label-trees__head"><button v-if="clearable" @click="clear" class="btn btn-default" title="Clear selected labels"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button><label-typeahead v-if="typeahead" :labels="labels" @select="handleSelect"></label-typeahead></div><div class="label-trees__body"><label-tree :name="tree.name" :labels="tree.labels" :multiselect="multiselect" v-for="tree in trees" @select="handleSelect" @deselect="handleDeselect"></label-tree></div></div>',components:{labelTypeahead:biigle.$require("labelTrees.components.labelTypeahead"),labelTree:biigle.$require("labelTrees.components.labelTree")},props:{trees:{type:Array,required:!0},typeahead:{type:Boolean,default:!0},clearable:{type:Boolean,default:!0},multiselect:{type:Boolean,default:!1}},computed:{labels:function(){for(var e=[],t=this.trees.length-1;t>=0;t--)Array.prototype.push.apply(e,this.trees[t].labels);return e}},methods:{handleSelect:function(e){this.$emit("select",e)},handleDeselect:function(e){this.$emit("deselect",e)},clear:function(){this.$emit("clear")}}}),biigle.$component("labelTrees.components.labelTypeahead",{template:'<typeahead class="label-typeahead clearfix" :data="labels" :placeholder="placeholder" :on-hit="selectLabel" :template="template" :disabled="disabled" :value="value" match-property="name"></typeahead>',data:function(){return{template:"{{item.name}}"}},components:{typeahead:VueStrap.typeahead},props:{labels:{type:Array,required:!0},placeholder:{type:String,default:"Label name"},disabled:{type:Boolean,default:!1},value:{type:String,default:""}},methods:{selectLabel:function(e,t){this.$emit("select",e),t.reset()}}}),biigle.$component("labelTrees.components.manualLabelForm",{mixins:[biigle.$require("labelTrees.mixins.labelFormComponent")],methods:{submit:function(){var e={name:this.selectedName,color:this.selectedColor};this.parent&&(e.parent_id=this.parent.id),this.$emit("submit",e)}}}),biigle.$component("labelTrees.components.wormsLabelForm",{mixins:[biigle.$require("labelTrees.mixins.labelFormComponent")],components:{wormsResultItem:biigle.$require("labelTrees.components.wormsResultItem")},data:function(){return{results:[],recursive:!1,hasSearched:!1}},computed:{hasResults:function(){return this.results.length>0},recursiveButtonClass:function(){return{active:this.recursive,"btn-primary":this.recursive}}},methods:{submit:function(){},findName:function(){var e=biigle.$require("labelTrees.wormsLabelSource"),t=biigle.$require("api.labelSource"),l=biigle.$require("messages.store"),i=this;this.$emit("load-start"),t.query({id:e.id,query:this.selectedName}).then(this.updateResults,l.handleErrorResponse).finally(function(){i.hasSearched=!0,i.$emit("load-finish")})},updateResults:function(e){this.results=e.data},importItem:function(e){var t=biigle.$require("labelTrees.wormsLabelSource"),l={name:e.name,color:this.selectedColor,source_id:e.aphia_id,label_source_id:t.id};this.recursive?l.recursive="true":this.parent&&(l.parent_id=this.parent.id),this.$emit("submit",l)},toggleRecursive:function(){this.recursive=!this.recursive}}}),biigle.$component("labelTrees.components.wormsResultItem",{props:{item:{type:Object,required:!0},recursive:{type:Boolean,required:!0},labels:{type:Array,required:!0},parent:{type:Object,default:null}},computed:{classification:function(){return this.item.parents.join(" > ")},buttonTitle:function(){return this.recursive?"Add "+this.item.name+" and all WoRMS parents as new labels":this.parent?"Add "+this.item.name+" as a child of "+this.parent.name:"Add "+this.item.name+" as a root label"},classObject:function(){return{"list-group-item-success":this.selected}},selected:function(){var e=this;return!!this.labels.find(function(t){return t.source_id==e.item.aphia_id})}},methods:{select:function(){this.selected||this.$emit("select",this.item)}}}),biigle.$component("labelTrees.mixins.labelFormComponent",{props:{labels:{type:Array,required:!0},color:{type:String,default:""},parent:{type:Object,default:null},name:{type:String,default:""}},components:{labelTypeahead:biigle.$require("labelTrees.components.labelTypeahead")},computed:{selectedColor:{get:function(){return this.color},set:function(e){this.$emit("color",e)}},selectedName:{get:function(){return this.name},set:function(e){this.$emit("name",e)}},selectedParent:function(){return this.parent?this.parent.name:""},hasNoLabels:function(){return 0===this.labels.length},hasNoParent:function(){return!this.parent},hasNoName:function(){return!this.name}},methods:{refreshColor:function(){this.selectedColor=biigle.$require("labelTrees.randomColor")()},resetParent:function(){this.$emit("parent",null)},selectLabel:function(e){this.$emit("parent",e)}}});