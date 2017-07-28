biigle.$viewModel("label-trees-authorized-projects",function(e){var t=biigle.$require("messages.store"),i=biigle.$require("api.projects"),l=biigle.$require("api.labelTree"),r=biigle.$require("labelTrees.privateVisibilityId");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{labelTree:biigle.$require("labelTrees.labelTree"),ownProjects:[],authorizedProjects:biigle.$require("labelTrees.authorizedProjects"),authorizedOwnProjects:biigle.$require("labelTrees.authorizedOwnProjects")},components:{typeahead:biigle.$require("core.components.typeahead")},computed:{isPrivate:function(){return this.labelTree.visibility_id===r},classObject:function(){return{"panel-warning":this.editing}},authorizableProjects:function(){var e=this;return this.ownProjects.filter(function(t){for(var i=e.authorizedProjects.length-1;i>=0;i--)if(e.authorizedProjects[i].id===t.id)return!1;return!0})},hasAuthorizedProjects:function(){return this.authorizedProjects.length>0}},methods:{fetchOwnProjects:function(){var e=this;i.query().then(function(t){Vue.set(e,"ownProjects",t.body)},t.handleErrorResponse)},addAuthorizedProject:function(e){var i=this;this.startLoading(),l.addAuthorizedProject({id:this.labelTree.id},{id:e.id}).then(function(){i.authorizedProjectAdded(e)},t.handleErrorResponse).finally(this.finishLoading)},authorizedProjectAdded:function(e){this.authorizedProjects.push(e),this.authorizedOwnProjects.push(e.id)},removeAuthorizedProject:function(e){var i=this;this.startLoading(),l.removeAuthorizedProject({id:this.labelTree.id,project_id:e.id}).then(function(){i.authorizedProjectRemoved(e)},t.handleErrorResponse).finally(this.finishLoading)},authorizedProjectRemoved:function(e){var t;for(t=this.authorizedProjects.length-1;t>=0;t--)this.authorizedProjects[t].id===e.id&&this.authorizedProjects.splice(t,1);-1!==(t=this.authorizedOwnProjects.indexOf(e.id))&&this.authorizedOwnProjects.splice(t,1)},isOwnProject:function(e){return-1!==this.authorizedOwnProjects.indexOf(e.id)}},created:function(){this.$once("editing.start",this.fetchOwnProjects)}})}),biigle.$viewModel("label-trees-labels",function(e){var t=biigle.$require("api.labels"),i=biigle.$require("messages.store"),l=biigle.$require("labelTrees.randomColor"),r=biigle.$require("labelTrees.labelTree"),a=biigle.$require("events");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{labels:biigle.$require("labelTrees.labels"),selectedColor:l(),selectedLabel:null,selectedName:""},components:{tabs:VueStrap.tabs,tab:VueStrap.tab,labelTree:biigle.$require("labelTrees.components.labelTree"),manualLabelForm:biigle.$require("labelTrees.components.manualLabelForm"),wormsLabelForm:biigle.$require("labelTrees.components.wormsLabelForm")},computed:{classObject:function(){return{"panel-warning":this.editing}}},methods:{deleteLabel:function(e){var l=this;this.startLoading(),t.delete({id:e.id}).then(function(){l.labelDeleted(e)},i.handleErrorResponse).finally(this.finishLoading)},labelDeleted:function(e){this.selectedLabel&&this.selectedLabel.id===e.id&&this.deselectLabel(e);for(var t=this.labels.length-1;t>=0;t--)if(this.labels[t].id===e.id){this.labels.splice(t,1);break}},selectLabel:function(e){this.selectedLabel=e,e?(this.selectedColor="#"+e.color,this.$emit("select",e),a.$emit("selectLabel",e)):(this.$emit("clear"),a.$emit("selectLabel",null))},deselectLabel:function(e){this.selectedLabel=null,this.$emit("deselect",e),a.$emit("selectLabel",null)},selectColor:function(e){this.selectedColor=e},selectName:function(e){this.selectedName=e},insertLabel:function(e){Vue.set(e,"open",!1),Vue.set(e,"selected",!1);for(var t=e.name.toLowerCase(),i=0,l=this.labels.length;i<l;i++)if(this.labels[i].name.toLowerCase()>=t)return void this.labels.splice(i,0,e);this.labels.push(e)},createLabel:function(e){this.loading||(this.startLoading(),t.save({label_tree_id:r.id},e).then(this.labelCreated,i.handleErrorResponse).finally(this.finishLoading))},labelCreated:function(e){e.data.forEach(this.insertLabel),this.selectedColor=l(),this.selectedName=""}}})}),biigle.$viewModel("label-trees-members",function(e){var t=biigle.$require("messages.store"),i=biigle.$require("labelTrees.labelTree"),l=biigle.$require("api.labelTree");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")],data:{members:biigle.$require("labelTrees.members"),roles:biigle.$require("labelTrees.roles"),defaultRole:biigle.$require("labelTrees.defaultRoleId"),userId:biigle.$require("labelTrees.userId")},components:{membersPanel:biigle.$require("core.components.membersPanel")},computed:{},methods:{attachMember:function(e){this.startLoading();var r=this;l.addUser({id:i.id},{id:e.id,role_id:e.role_id}).then(function(){r.memberAttached(e)},t.handleResponseError).finally(this.finishLoading)},memberAttached:function(e){this.members.push(e)},updateMember:function(e,r){this.startLoading();var a=this;l.updateUser({id:i.id,user_id:e.id},{role_id:r.role_id}).then(function(){a.memberUpdated(e,r)},t.handleResponseError).finally(this.finishLoading)},memberUpdated:function(e,t){e.role_id=t.role_id},removeMember:function(e){this.startLoading();var r=this;l.removeUser({id:i.id,user_id:e.id}).then(function(){r.memberRemoved(e)},t.handleResponseError).finally(this.finishLoading)},memberRemoved:function(e){for(var t=this.members.length-1;t>=0;t--)this.members[t].id===e.id&&this.members.splice(t,1)}}})}),biigle.$viewModel("label-trees-title",function(e){var t=biigle.$require("messages.store"),i=biigle.$require("labelTrees.labelTree"),l=biigle.$require("labelTrees.privateVisibilityId"),r=biigle.$require("api.labelTree");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{labelTree:i,name:i.name,description:i.description,visibility_id:i.visibility_id},computed:{isPrivate:function(){return this.labelTree.visibility_id===l},hasDescription:function(){return!!this.description},isChanged:function(){return this.name!==this.labelTree.name||this.description!==this.labelTree.description||parseInt(this.visibility_id)!==this.labelTree.visibility_id}},methods:{discardChanges:function(){this.finishEditing(),this.name=this.labelTree.name,this.description=this.labelTree.description,this.visibility_id=this.labelTree.visibility_id},leaveTree:function(){confirm("Do you really want to leave the label tree "+this.labelTree.name+"?")&&(this.startLoading(),r.removeUser({id:this.labelTree.id,user_id:biigle.$require("labelTrees.userId")}).then(this.treeLeft,t.handleErrorResponse).finally(this.finishLoading))},treeLeft:function(){this.isPrivate?(t.success("You left the label tree. Redirecting..."),setTimeout(function(){location.href=biigle.$require("labelTrees.redirectUrl")},2e3)):location.reload()},deleteTree:function(){confirm("Do you really want to delete the label tree "+this.labelTree.name+"?")&&(this.startLoading(),r.delete({id:this.labelTree.id}).then(this.treeDeleted,t.handleErrorResponse).finally(this.finishLoading))},treeDeleted:function(){t.success("The label tree was deleted. Redirecting..."),setTimeout(function(){location.href=biigle.$require("labelTrees.redirectUrl")},2e3)},saveChanges:function(){this.startLoading(),r.update({id:this.labelTree.id},{name:this.name,description:this.description,visibility_id:this.visibility_id}).then(this.changesSaved,t.handleErrorResponse).finally(this.finishLoading)},changesSaved:function(){this.labelTree.name=this.name,this.labelTree.description=this.description,this.labelTree.visibility_id=parseInt(this.visibility_id),this.finishEditing()}}})}),biigle.$declare("labelTrees.randomColor",function(){var e=[0,.5,.9],t=[360,1,1],i=[0,2,2],l=function(e){var t,i=e[0]/60,l=Math.floor(i),r=i-l,a=[e[2]*(1-e[1]),e[2]*(1-e[1]*r),e[2]*(1-e[1]*(1-r))];switch(l){case 1:t=[a[1],e[2],a[0]];break;case 2:t=[a[0],e[2],a[2]];break;case 3:t=[a[0],a[1],e[2]];break;case 4:t=[a[2],a[0],e[2]];break;case 5:t=[e[2],a[0],a[1]];break;default:t=[e[2],a[2],a[0]]}return t.map(function(e){return Math.round(255*e)})},r=function(e){return e.map(function(e){return e=e.toString(16),1===e.length?"0"+e:e})};return function(){for(var a,s=[0,0,0],o=s.length-1;o>=0;o--)a=10*i[o],s[o]=(t[o]-e[o])*Math.random()+e[o],s[o]=0!==a?Math.round(s[o]*a)/a:Math.round(s[o]);return"#"+r(l(s)).join("")}}),biigle.$component("labelTrees.components.labelTree",{template:'<div class="label-tree"><h4 class="label-tree__title" v-if="showTitle"><button v-if="collapsible" @click.stop="collapse" class="btn btn-default btn-xs pull-right" :title="collapseTitle"><span v-if="collapsed" class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span><span v-else class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span></button>{{name}}</h4><ul v-if="!collapsed" class="label-tree__list"><label-tree-label :label="label" :deletable="deletable" :show-favourites="showFavourites" :flat="flat" v-for="label in rootLabels" @select="emitSelect" @deselect="emitDeselect" @delete="emitDelete" @add-favourite="emitAddFavourite" @remove-favourite="emitRemoveFavourite"></label-tree-label><li v-if="hasNoLabels" class="text-muted">No labels</li></ul></div>',data:function(){return{collapsed:!1}},components:{labelTreeLabel:biigle.$require("labelTrees.components.labelTreeLabel")},props:{name:{type:String,required:!0},labels:{type:Array,required:!0},showTitle:{type:Boolean,default:!0},standalone:{type:Boolean,default:!1},collapsible:{type:Boolean,default:!0},multiselect:{type:Boolean,default:!1},deletable:{type:Boolean,default:!1},showFavourites:{type:Boolean,default:!1},flat:{type:Boolean,default:!1}},computed:{labelMap:function(){for(var e={},t=this.labels.length-1;t>=0;t--)e[this.labels[t].id]=this.labels[t];return e},compiledLabels:function(){var e={null:[]};return this.flat?this.labels.forEach(function(t){e[null].push(t)}):(this.labels.forEach(function(t){e.hasOwnProperty(t.parent_id)?e[t.parent_id].push(t):e[t.parent_id]=[t]}),this.labels.forEach(function(t){e.hasOwnProperty(t.id)?Vue.set(t,"children",e[t.id]):(Vue.set(t,"children",void 0),t.open=!1)})),e},rootLabels:function(){return this.compiledLabels[null]},collapseTitle:function(){return this.collapsed?"Expand":"Collapse"},hasNoLabels:function(){return 0===this.rootLabels.length}},methods:{hasLabel:function(e){return this.labelMap.hasOwnProperty(e)},getLabel:function(e){return this.labelMap[e]},getParents:function(e){for(var t=[];null!==e.parent_id;)e=this.getLabel(e.parent_id),t.unshift(e.id);return t},emitSelect:function(e){this.$emit("select",e)},emitDeselect:function(e){this.$emit("deselect",e)},emitDelete:function(e){this.$emit("delete",e)},selectLabel:function(e){if(this.multiselect||this.clearSelectedLabels(),e&&this.hasLabel(e.id)&&(e.selected=!0,this.collapsed=!1,!this.flat))for(var t=this.getParents(e),i=t.length-1;i>=0;i--)this.getLabel(t[i]).open=!0},deselectLabel:function(e){this.hasLabel(e.id)&&(e.selected=!1)},clearSelectedLabels:function(){this.labels.forEach(function(e){e.selected=!1})},collapse:function(){if(this.collapsed)this.collapsed=!1;else{var e=!1;this.labels.forEach(function(t){e|=t.open,t.open=!1}),this.collapsed=!e}},emitAddFavourite:function(e){this.$emit("add-favourite",e)},emitRemoveFavourite:function(e){this.$emit("remove-favourite",e)},addFavouriteLabel:function(e){this.hasLabel(e.id)&&(e.favourite=!0)},removeFavouriteLabel:function(e){this.hasLabel(e.id)&&(e.favourite=!1)}},created:function(){this.labels.forEach(function(e){e.hasOwnProperty("open")||Vue.set(e,"open",!1),e.hasOwnProperty("selected")||Vue.set(e,"selected",!1),e.hasOwnProperty("favourite")||Vue.set(e,"favourite",!1)}),this.standalone?(this.$on("select",this.selectLabel),this.$on("deselect",this.deselectLabel)):(this.$parent.$on("select",this.selectLabel),this.$parent.$on("deselect",this.deselectLabel),this.$parent.$on("clear",this.clearSelectedLabels),this.$parent.$on("add-favourite",this.addFavouriteLabel),this.$parent.$on("remove-favourite",this.removeFavouriteLabel))}}),biigle.$component("labelTrees.components.labelTreeLabel",{name:"label-tree-label",template:'<li class="label-tree-label" :class="classObject"><div class="label-tree-label__name" @click="toggleOpen" @mouseover="doHover" @mouseleave="dontHover"><span v-show="showColor" class="label-tree-label__color" :style="colorStyle"></span><span v-if="showChevronDown" class="label-tree-label__chevron label-tree-label__chevron--down" :style="chevronStyle"></span><span v-if="showChevronUp" class="label-tree-label__chevron label-tree-label__chevron--up" :style="chevronStyle"></span><span v-text="label.name" @click.stop="toggleSelect" @mouseenter="dontHover"></span><button v-if="showFavourites" class="label-tree-label__favourite" @click.stop="toggleFavourite" :title="favouriteTitle"><span class="glyphicon" :class="favouriteClass" aria-hidden="true" title=""></span></button><button v-if="deletable" type="button" class="close label-tree-label__delete" :title="deleteTitle" @click.stop="deleteThis"><span aria-hidden="true">&times;</span></button></div><ul v-if="expandable && label.open" class="label-tree__list"><label-tree-label :label="child" :deletable="deletable" :show-favourites="showFavourites" v-for="child in label.children" @select="emitSelect" @deselect="emitDeselect" @delete="emitDelete" @add-favourite="emitAddFavourite" @remove-favourite="emitRemoveFavourite"></label-tree-label></ul></li>',data:function(){return{hover:!1}},props:{label:{type:Object,required:!0},showFavourites:{type:Boolean,required:!1},deletable:{type:Boolean,default:!1},flat:{type:Boolean,default:!1}},computed:{showColor:function(){return!this.expandable||!this.hover},showChevronUp:function(){return!this.showColor&&this.label.open},showChevronDown:function(){return!this.showColor&&!this.label.open},classObject:function(){return{"label-tree-label--selected":this.label.selected,"label-tree-label--expandable":this.expandable}},colorStyle:function(){return{"background-color":"#"+this.label.color}},chevronStyle:function(){return{color:"#"+this.label.color}},favouriteClass:function(){return{"glyphicon-star-empty":!this.label.favourite,"glyphicon-star":this.label.favourite}},favouriteTitle:function(){return(this.label.favourite?"Remove":"Add")+" as favourite"},deleteTitle:function(){return"Remove label "+this.label.name},expandable:function(){return!this.flat&&!!this.label.children}},methods:{toggleSelect:function(){this.label.selected?this.$emit("deselect",this.label):this.$emit("select",this.label)},deleteThis:function(){this.emitDelete(this.label)},toggleOpen:function(){this.expandable?this.label.open=!this.label.open:this.toggleSelect()},toggleFavourite:function(){this.label.favourite?this.emitRemoveFavourite(this.label):this.emitAddFavourite(this.label)},emitSelect:function(e){this.$emit("select",e)},emitDeselect:function(e){this.$emit("deselect",e)},emitDelete:function(e){this.$emit("delete",e)},emitAddFavourite:function(e){this.$emit("add-favourite",e)},emitRemoveFavourite:function(e){this.$emit("remove-favourite",e)},doHover:function(){this.hover=!0},dontHover:function(){this.hover=!1}}}),biigle.$component("labelTrees.components.labelTrees",{template:'<div class="label-trees"><div v-if="typeahead || clearable" class="label-trees__head"><button v-if="clearable" @click="clear" class="btn btn-default" title="Clear selected labels"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button><typeahead v-if="typeahead" :items="labels" @select="handleSelect" placeholder="Label name"></typeahead></div><div class="label-trees__body"><label-tree v-if="hasFavourites" name="Favourites" :labels="favourites" :show-favourites="showFavourites" :flat="true" @select="handleSelect" @deselect="handleDeselect" @remove-favourite="handleRemoveFavourite"></label-tree><label-tree :name="tree.name" :labels="tree.labels" :multiselect="multiselect" :show-favourites="showFavourites" v-for="tree in trees" @select="handleSelect" @deselect="handleDeselect"  @add-favourite="handleAddFavourite" @remove-favourite="handleRemoveFavourite"></label-tree></div></div>',components:{typeahead:biigle.$require("core.components.typeahead"),labelTree:biigle.$require("labelTrees.components.labelTree")},data:function(){return{favourites:[]}},props:{trees:{type:Array,required:!0},id:{type:String},typeahead:{type:Boolean,default:!0},clearable:{type:Boolean,default:!0},multiselect:{type:Boolean,default:!1},showFavourites:{type:Boolean,default:!1}},computed:{localeCompareSupportsLocales:function(){try{"foo".localeCompare("bar","i")}catch(e){return"RangeError"===e.name}return!1},labels:function(){var e=[];if(this.trees.forEach(function(t){Array.prototype.push.apply(e,t.labels)}),this.localeCompareSupportsLocales){var t=new Intl.Collator(void 0,{numeric:!0,sensitivity:"base"});e.sort(function(e,i){return t.compare(e.name,i.name)})}else e.sort(function(e,t){return e.name<t.name?-1:1});return e},favouriteIds:function(){return this.favourites.map(function(e){return e.id})},canHaveMoreFavourites:function(){return this.favourites.length<10},hasFavourites:function(){return this.favourites.length>0},ownId:function(){if(this.id)return this.id;var e=[];for(var t in this.trees)this.trees.hasOwnProperty(t)&&e.push(this.trees[t].id);return e.join("-")},favouriteStorageKey:function(){return"biigle.label-trees."+this.ownId+".favourites"}},methods:{handleSelect:function(e){this.$emit("select",e)},handleDeselect:function(e){this.$emit("deselect",e)},clear:function(){this.$emit("clear")},handleAddFavourite:function(e){this.canHaveMoreFavourites&&(this.$emit("add-favourite",e),this.favourites.push(e),this.updateFavouriteStorage())},handleRemoveFavourite:function(e){this.$emit("remove-favourite",e);var t=this.favourites.indexOf(e);-1!==t&&this.favourites.splice(t,1),this.updateFavouriteStorage()},updateFavouriteStorage:function(){this.hasFavourites?localStorage.setItem(this.favouriteStorageKey,JSON.stringify(this.favouriteIds)):localStorage.removeItem(this.favouriteStorageKey)},selectFavourite:function(e){this.favourites[e]&&this.handleSelect(this.favourites[e])}},mounted:function(){if(this.showFavourites){var e=JSON.parse(localStorage.getItem(this.favouriteStorageKey));if(e){var t=[];this.labels.forEach(function(i){var l=e.indexOf(i.id);-1!==l&&(t[l]=i)}),t.filter(Boolean).forEach(function(e){this.handleAddFavourite(e)},this)}for(var i=biigle.$require("keyboard"),l=this,r=function(e,t){i.on(e,function(){l.selectFavourite(t)})},a=1;a<=9;a++)r(a.toString(),a-1);r("0",9)}}}),biigle.$component("labelTrees.components.manualLabelForm",{mixins:[biigle.$require("labelTrees.mixins.labelFormComponent")],methods:{submit:function(){var e={name:this.selectedName,color:this.selectedColor};this.parent&&(e.parent_id=this.parent.id),this.$emit("submit",e)}}}),biigle.$component("labelTrees.components.wormsLabelForm",{mixins:[biigle.$require("labelTrees.mixins.labelFormComponent")],components:{wormsResultItem:biigle.$require("labelTrees.components.wormsResultItem")},data:function(){return{results:[],recursive:!1,hasSearched:!1}},computed:{hasResults:function(){return this.results.length>0},recursiveButtonClass:function(){return{active:this.recursive,"btn-primary":this.recursive}}},methods:{findName:function(){var e=biigle.$require("labelTrees.wormsLabelSource"),t=biigle.$require("api.labelSource"),i=biigle.$require("messages.store"),l=this;this.$emit("load-start"),t.query({id:e.id,query:this.selectedName}).then(this.updateResults,i.handleErrorResponse).finally(function(){l.hasSearched=!0,l.$emit("load-finish")})},updateResults:function(e){this.results=e.data},importItem:function(e){var t=biigle.$require("labelTrees.wormsLabelSource"),i={name:e.name,color:this.selectedColor,source_id:e.aphia_id,label_source_id:t.id};this.recursive?i.recursive="true":this.parent&&(i.parent_id=this.parent.id),this.$emit("submit",i)},toggleRecursive:function(){this.recursive=!this.recursive}}}),biigle.$component("labelTrees.components.wormsResultItem",{props:{item:{type:Object,required:!0},recursive:{type:Boolean,required:!0},labels:{type:Array,required:!0},parent:{type:Object,default:null}},computed:{classification:function(){return this.item.parents.join(" > ")},buttonTitle:function(){return this.recursive?"Add "+this.item.name+" and all WoRMS parents as new labels":this.parent?"Add "+this.item.name+" as a child of "+this.parent.name:"Add "+this.item.name+" as a root label"},classObject:function(){return{"list-group-item-success":this.selected}},selected:function(){var e=this;return!!this.labels.find(function(t){return t.source_id==e.item.aphia_id})}},methods:{select:function(){this.selected||this.$emit("select",this.item)}}}),biigle.$component("labelTrees.mixins.labelFormComponent",{props:{labels:{type:Array,required:!0},color:{type:String,default:""},parent:{type:Object,default:null},name:{type:String,default:""}},components:{typeahead:biigle.$require("core.components.typeahead")},computed:{selectedColor:{get:function(){return this.color},set:function(e){this.$emit("color",e)}},selectedName:{get:function(){return this.name},set:function(e){this.$emit("name",e)}},selectedParent:function(){return this.parent?this.parent.name:""},hasNoLabels:function(){return 0===this.labels.length},hasNoParent:function(){return!this.parent},hasNoName:function(){return!this.name}},methods:{refreshColor:function(){this.selectedColor=biigle.$require("labelTrees.randomColor")()},resetParent:function(){this.$emit("parent",null)},selectLabel:function(e){this.$emit("parent",e)}}});