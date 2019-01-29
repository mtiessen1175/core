biigle.$viewModel("create-video-form",function(e){new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")]})}),biigle.$viewModel("video-container",function(e){var t=biigle.$require("videos.id"),n=biigle.$require("videos.src"),i=biigle.$require("videos.shapes"),o=biigle.$require("videos.api.videoAnnotations"),a=biigle.$require("messages.store");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")],components:{videoScreen:biigle.$require("videos.components.videoScreen"),videoTimeline:biigle.$require("videos.components.videoTimeline"),sidebar:biigle.$require("core.components.sidebar"),sidebarTab:biigle.$require("core.components.sidebarTab"),labelTrees:biigle.$require("labelTrees.components.labelTrees")},data:{video:document.createElement("video"),labelTrees:biigle.$require("videos.labelTrees"),selectedLabel:null,bookmarks:[],annotations:[],seeking:!1},computed:{shapes:function(){var e={};return Object.keys(i).forEach(function(t){e[i[t]]=t}),e},selectedAnnotations:function(){return this.annotations.filter(function(e){return!1!==e.selected})}},methods:{prepareAnnotation:function(e){return e.selected=!1,e.shape=i[e.shape_id],e},setAnnotations:function(e){this.annotations=e.body.map(this.prepareAnnotation)},addCreatedAnnotation:function(e){this.annotations.push(this.prepareAnnotation(e.body))},seek:function(e){this.seeking||(this.seeking=!0,this.video.currentTime=e)},selectAnnotation:function(e,t){this.selectAnnotations([e],[t])},selectAnnotations:function(e,t){this.deselectAnnotations(),e.forEach(function(e,n){e.selected=t[n]}),t&&t.length>0&&this.seek(t[0])},deselectAnnotations:function(){this.annotations.forEach(function(e){e.selected=!1})},createBookmark:function(e){this.bookmarks.reduce(function(t,n){return t||n.time===e},!1)||this.bookmarks.push({time:e})},createAnnotation:function(e){var n=Object.assign(e,{shape_id:this.shapes[e.shape],label_id:this.selectedLabel?this.selectedLabel.id:0});delete n.shape,o.save({id:t},n).then(this.addCreatedAnnotation,a.handleResponseError)},handleSelectedLabel:function(e){this.selectedLabel=e},handleDeselectedLabel:function(){this.selectedLabel=null},deleteSelectedAnnotations:function(){confirm("Are you sure that you want to delete all selected annotations?")&&this.selectedAnnotations.forEach(function(e){o.delete({id:e.id}).then(this.deletedAnnotation(e)).catch(a.handleResponseError)},this)},deletedAnnotation:function(e){return function(){var t=this.annotations.indexOf(e);-1!==t&&this.annotations.splice(t,1)}.bind(this)},handleVideoSeeked:function(){this.seeking=!1}},watch:{},created:function(){this.video.muted=!0,this.video.addEventListener("error",function(){a.danger("Error while loading video file.")}),this.video.addEventListener("seeked",this.handleVideoSeeked),this.startLoading();var e=this,n=new Vue.Promise(function(t,n){e.video.addEventListener("loadeddata",t),e.video.addEventListener("error",n)}),i=o.query({id:t});i.then(this.setAnnotations,a.handleResponseError),Vue.Promise.all([n,i]).then(this.finishLoading)},mounted:function(){this.video.src=n}})}),biigle.$component("videos.components.annotationClip",{template:'<div class="annotation-clip" v-show="duration > 0" :style="style" :class="classObj" @click.stop="select($event)"><keyframe v-for="(frame, i) in keyframes" :frame="frame" @select="selectFrame(i)"></keyframe></div>',components:{keyframe:{template:'<span class="annotation-keyframe" :style="style" :class="classObj" @click.stop="emitSelect"></span>',props:{frame:{type:Object,required:!0}},computed:{offset:function(){return(this.frame.time-this.$parent.startFrame)/this.$parent.clipDuration},style:function(){return{left:100*this.offset+"%","background-color":"#"+this.$parent.color}},classObj:function(){return{"annotation-keyframe--selected":this.frame.selected}}},methods:{emitSelect:function(){this.$emit("select")}}}},props:{annotation:{type:Object,required:!0},label:{type:Object,required:!0},duration:{type:Number,required:!0}},data:function(){return{}},computed:{startFrame:function(){return this.annotation.frames[0]},endFrame:function(){return this.annotation.frames[this.annotation.frames.length-1]},offset:function(){return this.startFrame/this.duration},clipDuration:function(){return this.endFrame-this.startFrame},width:function(){return this.clipDuration/this.duration},color:function(){return this.label.color||"000000"},style:function(){return{left:100*this.offset+"%",width:100*this.width+"%","background-color":"#"+this.color+"66"}},keyframes:function(){var e=this.annotation.selected;return this.annotation.frames.map(function(t){return{time:t,selected:e===t}})},selected:function(){return!1!==this.annotation.selected},classObj:function(){return{"annotation-clip--selected":this.selected}}},methods:{emitSelect:function(e){this.$emit("select",this.annotation,e)},selectFrame:function(e){this.emitSelect(this.annotation.frames[e])},select:function(e){this.emitSelect(this.startFrame+(e.clientX-e.target.getBoundingClientRect().left)/e.target.clientWidth*this.clipDuration)}},mounted:function(){}}),biigle.$component("videos.components.annotationTrack",{template:'<div class="annotation-track"><div class="annotation-lane" v-for="lane in lanes"><annotation-clip v-for="annotation in lane" :annotation="annotation" :label="label" :duration="duration" @select="emitSelect"></annotation-clip></div></div>',components:{annotationClip:biigle.$require("videos.components.annotationClip")},props:{label:{type:Object,required:!0},lanes:{type:Array,required:!0},duration:{type:Number,required:!0}},data:function(){return{}},computed:{},methods:{emitSelect:function(e,t){this.$emit("select",e,t)}},watch:{}}),biigle.$component("videos.components.annotationTracks",{template:'<div class="annotation-tracks" @click="emitDeselect" @scroll.stop="handleScroll"><annotation-track v-for="track in tracks" :label="track.label" :lanes="track.lanes" :duration="duration" @select="emitSelect"></annotation-track></div>',components:{annotationTrack:biigle.$require("videos.components.annotationTrack")},props:{tracks:{type:Array,required:!0},duration:{type:Number,required:!0}},data:function(){return{}},computed:{},methods:{emitSelect:function(e,t){this.$emit("select",e,t)},emitDeselect:function(){this.$emit("deselect")},handleScroll:function(){this.$emit("scroll-y",this.$el.scrollTop)}}}),biigle.$component("videos.components.currentTimeIndicator",{template:'<span class="time-indicator" :style="style"></span>',props:{duration:{type:Number,required:!0},currentTime:{type:Number,required:!0}},data:function(){return{parentWidth:0}},computed:{style:function(){if(this.duration>0){return"transform: translateX("+this.parentWidth*this.currentTime/this.duration+"px);"}}},methods:{updateParentWidth:function(){this.parentWidth=this.$el.parentElement.clientWidth}},mounted:function(){this.updateParentWidth()}}),biigle.$component("videos.components.scrollStrip",{template:'<div class="scroll-strip"><video-progress :bookmarks="bookmarks" :duration="duration" @seek="emitSeek"></video-progress><annotation-tracks :tracks="tracks" :duration="duration" @select="emitSelect" @deselect="emitDeselect" @scroll-y="emitScrollY"></annotation-tracks><span class="time-indicator" :class="indicatorClass" :style="indicatorStyle"></span></div>',components:{videoProgress:biigle.$require("videos.components.videoProgress"),annotationTracks:biigle.$require("videos.components.annotationTracks")},props:{tracks:{type:Array,required:function(){return[]}},bookmarks:{type:Array,required:function(){return[]}},duration:{type:Number,required:!0},currentTime:{type:Number,required:!0},seeking:{type:Boolean,default:!1}},data:function(){return{elementWidth:0}},computed:{currentTimeOffset:function(){return this.duration>0?Math.round(this.elementWidth*this.currentTime/this.duration):0},indicatorClass:function(){return{"time-indicator--seeking":this.seeking}},indicatorStyle:function(){return"transform: translateX("+this.currentTimeOffset+"px);"}},methods:{updateElementWidth:function(){this.elementWidth=this.$el.clientWidth},emitSeek:function(e){this.$emit("seek",e)},emitSelect:function(e,t){this.$emit("select",e,t)},emitDeselect:function(){this.$emit("deselect")},emitScrollY:function(e){this.$emit("scroll-y",e)}},created:function(){window.addEventListener("resize",this.updateElementWidth);var e=this;biigle.$require("events").$on("sidebar.toggle",function(){e.$nextTick(e.updateElementWidth)}),biigle.$require("keyboard").on(" ",function(e){e.preventDefault()})},mounted:function(){this.updateElementWidth()}}),biigle.$component("videos.components.trackHeaders",{template:'<div class="track-headers"><div class="track-header" v-for="track in tracks"><div class="label-name" v-text="track.label.name"></div><div class="lane-dummy" v-for="lane in track.lanes"></div></div></div>',props:{tracks:{type:Array,required:!0},scrollTop:{type:Number,default:0}},data:function(){return{}},computed:{},methods:{},watch:{scrollTop:function(e){this.$el.scrollTop=e}}}),biigle.$component("videos.components.videoProgress",{template:'<div class="video-progress" @click="emitSeek"><bookmark v-for="mark in bookmarks" :bookmark="mark" @select="emitSelectBookmark"></bookmark></div>',props:{duration:{type:Number,required:!0},bookmarks:{type:Array,default:function(){return[]}}},components:{bookmark:{template:'<span class="bookmark" :style="style" @click.stop="emitSelect"></span>',props:{bookmark:{type:Object,required:!0}},computed:{style:function(){return"left: "+100*this.bookmark.time/this.$parent.duration+"%"}},methods:{emitSelect:function(){this.$emit("select",this.bookmark)}}}},data:function(){return{}},computed:{},methods:{emitSeek:function(e){this.$emit("seek",(e.clientX-e.target.getBoundingClientRect().left)/e.target.clientWidth*this.duration)},emitSelectBookmark:function(e){this.$emit("seek",e.time)}},mounted:function(){}}),biigle.$component("videos.components.videoScreen",{mixins:[biigle.$require("videos.components.videoScreen.videoPlayback"),biigle.$require("videos.components.videoScreen.annotationPlayback")],template:'<div class="video-screen"><div class="controls"><div class="btn-group"><control-button v-if="playing" icon="fa-pause" title="Pause 𝗦𝗽𝗮𝗰𝗲𝗯𝗮𝗿" v-on:click="pause"></control-button><control-button v-else icon="fa-play" title="Play 𝗦𝗽𝗮𝗰𝗲𝗯𝗮𝗿" v-on:click="play"></control-button></div><div v-if="canAdd" class="btn-group"><control-button icon="icon-point" title="Start a point annotation 𝗔" v-on:click="drawPoint" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingPoint" :active="isDrawingPoint"><control-button icon="fa-check" title="Finish the point annotation" v-on:click="finishDrawAnnotation"></control-button></control-button><control-button icon="icon-rectangle" title="Start a rectangle annotation 𝗦" v-on:click="drawRectangle" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingRectangle" :active="isDrawingRectangle"><control-button icon="fa-check" title="Finish the rectangle annotation" v-on:click="finishDrawAnnotation"></control-button></control-button><control-button icon="icon-circle" title="Start a circle annotation 𝗗" v-on:click="drawCircle" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingCircle" :active="isDrawingCircle"><control-button icon="fa-check" title="Finish the circle annotation" v-on:click="finishDrawAnnotation"></control-button></control-button><control-button icon="icon-linestring" title="Start a line annotation 𝗙" v-on:click="drawLineString" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingLineString" :active="isDrawingLineString"><control-button icon="fa-check" title="Finish the line annotation" v-on:click="finishDrawAnnotation"></control-button></control-button><control-button icon="icon-polygon" title="Start a polygon annotation 𝗚" v-on:click="drawPolygon" :disabled="hasNoSelectedLabel" :hover="false" :open="isDrawingPolygon" :active="isDrawingPolygon"><control-button icon="fa-check" title="Finish the polygon annotation" v-on:click="finishDrawAnnotation"></control-button></control-button></div><div v-if="canDelete || canAdd" class="btn-group"><control-button v-if="canDelete" icon="fa-trash" title="Delete selected annotations 𝗗𝗲𝗹𝗲𝘁𝗲" v-on:click="emitDelete" :disabled="!hasSelectedAnnotations"></control-button><control-button v-if="canAdd" icon="fa-bookmark" title="Create a bookmark 𝗕" v-on:click="emitCreateBookmark"></control-button></div></div></div>',components:{controlButton:biigle.$require("annotations.components.controlButton")},props:{annotations:{type:Array,default:function(){return[]}},canAdd:{type:Boolean,default:!1},canModify:{type:Boolean,default:!1},canDelete:{type:Boolean,default:!1},listenerSet:{type:String,default:"default"},selectedAnnotations:{type:Array,default:function(){return[]}},selectedLabel:{type:Object},video:{type:HTMLVideoElement,required:!0}},data:function(){return{pendingAnnotation:{},interactionMode:"default"}},computed:{hasSelectedLabel:function(){return!!this.selectedLabel},hasNoSelectedLabel:function(){return!this.selectedLabel},hasSelectedAnnotations:function(){return this.selectedAnnotations.length>0},isDrawing:function(){return this.interactionMode.startsWith("draw")},isDrawingPoint:function(){return"drawPoint"===this.interactionMode},isDrawingRectangle:function(){return"drawRectangle"===this.interactionMode},isDrawingCircle:function(){return"drawCircle"===this.interactionMode},isDrawingLineString:function(){return"drawLineString"===this.interactionMode},isDrawingPolygon:function(){return"drawPolygon"===this.interactionMode}},methods:{createMap:function(){var e=new ol.Map({renderer:"canvas",controls:[new ol.control.Zoom,new ol.control.ZoomToExtent({tipLabel:"Zoom to show whole video",label:""})],interactions:ol.interaction.defaults({altShiftDragRotate:!1,doubleClickZoom:!1,keyboard:!1,shiftDragZoom:!1,pinchRotate:!1,pinchZoom:!1})}),t=biigle.$require("annotations.ol.ZoomToNativeControl");return e.addControl(new t({label:""})),e},initLayersAndInteractions:function(e){var t=biigle.$require("annotations.stores.styles");this.annotationFeatures=new ol.Collection,this.annotationSource=new ol.source.Vector({features:this.annotationFeatures}),this.annotationLayer=new ol.layer.Vector({source:this.annotationSource,updateWhileAnimating:!0,updateWhileInteracting:!0,style:t.features}),this.pendingAnnotationSource=new ol.source.Vector,this.pendingAnnotationLayer=new ol.layer.Vector({opacity:.5,source:this.pendingAnnotationSource,updateWhileAnimating:!0,updateWhileInteracting:!0,style:t.editing}),this.selectInteraction=new ol.interaction.Select({condition:ol.events.condition.click,style:t.highlight,layers:[this.annotationLayer],multi:!0}),this.selectedFeatures=this.selectInteraction.getFeatures(),this.selectInteraction.on("select",this.handleFeatureSelect),this.annotationLayer.setMap(e),this.pendingAnnotationLayer.setMap(e),e.addInteraction(this.selectInteraction)},emitCreateBookmark:function(){this.$emit("create-bookmark",this.video.currentTime)},draw:function(e){this["isDrawing"+e]?this.resetInteractionMode():this.canAdd&&(this.interactionMode="draw"+e)},drawPoint:function(){this.draw("Point")},drawRectangle:function(){this.draw("Rectangle")},drawCircle:function(){this.draw("Circle")},drawLineString:function(){this.draw("LineString")},drawPolygon:function(){this.draw("Polygon")},maybeUpdateDrawInteractionMode:function(e){if(this.resetPendingAnnotation(),this.drawInteraction&&(this.map.removeInteraction(this.drawInteraction),this.drawInteraction=void 0),this.isDrawing&&this.hasSelectedLabel){var t=e.slice(4);this.pause(),this.drawInteraction=new ol.interaction.Draw({source:this.pendingAnnotationSource,type:t,style:biigle.$require("annotations.stores.styles").editing}),this.drawInteraction.on("drawend",this.extendPendingAnnotation),this.map.addInteraction(this.drawInteraction),this.pendingAnnotation.shape=t}},resetInteractionMode:function(){this.interactionMode="default"},finishDrawAnnotation:function(){this.$emit("create-annotation",this.pendingAnnotation),this.resetInteractionMode()},resetPendingAnnotation:function(){this.pendingAnnotationSource.clear(),this.pendingAnnotation={shape:"",frames:[],points:[]}},extendPendingAnnotation:function(e){var t=this.pendingAnnotation.frames[this.pendingAnnotation.frames.length-1];void 0===t||t<this.video.currentTime?(this.pendingAnnotation.frames.push(this.video.currentTime),this.pendingAnnotation.points.push(this.getPointsFromGeometry(e.feature.getGeometry()))):this.pendingAnnotationSource.once("addfeature",function(e){this.removeFeature(e.feature)})},handleFeatureSelect:function(e){this.$emit("select",e.selected.map(function(e){return e.get("annotation")}),e.selected.map(function(){return this.video.currentTime},this))},emitDelete:function(){this.canDelete&&this.hasSelectedAnnotations&&this.$emit("delete")}},watch:{selectedAnnotations:function(e){var t=this.annotationSource,n=this.selectedFeatures;if(t&&n){var i;n.clear(),e.forEach(function(e){(i=t.getFeatureById(e.id))&&n.push(i)})}}},created:function(){this.$once("map-ready",this.initLayersAndInteractions),this.map=this.createMap(),this.$emit("map-created",this.map);var e=biigle.$require("keyboard");this.canAdd&&(e.on("a",this.drawPoint,0,this.listenerSet),e.on("s",this.drawRectangle,0,this.listenerSet),e.on("d",this.drawCircle,0,this.listenerSet),e.on("f",this.drawLineString,0,this.listenerSet),e.on("g",this.drawPolygon,0,this.listenerSet),this.$watch("interactionMode",this.maybeUpdateDrawInteractionMode),e.on("b",this.emitCreateBookmark)),this.canDelete&&e.on("Delete",this.emitDelete);var t=this;biigle.$require("events").$on("sidebar.toggle",function(){t.$nextTick(function(){t.map.updateSize()})})},mounted:function(){this.map.setTarget(this.$el)}}),biigle.$component("videos.components.videoTimeline",{template:'<div class="video-timeline"><div class="static-strip"><div class="current-time" v-text="currentTimeString"></div><track-headers ref="trackheaders" :tracks="annotationTracks" :scroll-top="scrollTop"></track-headers></div><scroll-strip :tracks="annotationTracks" :duration="duration" :current-time="currentTime" :bookmarks="bookmarks" :seeking="seeking" @seek="emitSeek" @select="emitSelect" @deselect="emitDeselect" @scroll-y="handleScrollY"></scroll-strip></div>',components:{trackHeaders:biigle.$require("videos.components.trackHeaders"),scrollStrip:biigle.$require("videos.components.scrollStrip")},props:{annotations:{type:Array,default:function(){return[]}},video:{type:HTMLVideoElement,required:!0},bookmarks:{type:Array,default:function(){return[]}},seeking:{type:Boolean,default:!1}},data:function(){return{animationFrameId:null,refreshRate:30,refreshLastTime:Date.now(),currentTime:0,currentTimeDate:new Date(0),currentTimeString:"00:00:00.000",duration:0,scrollTop:0}},computed:{labelMap:function(){var e={};return this.annotations.forEach(function(t){t.labels.forEach(function(t){e.hasOwnProperty(t.label_id)||(e[t.label_id]=t.label)})}),e},annotationTracks:function(){var e={};return this.annotations.forEach(function(t){t.labels.forEach(function(n){e.hasOwnProperty(n.label_id)||(e[n.label_id]=[]),e[n.label_id].push(t)})}),Object.keys(e).map(function(t){return{label:this.labelMap[t],lanes:this.getAnnotationTrackLanes(e[t])}},this)}},methods:{startUpdateLoop:function(){var e=Date.now();e-this.refreshLastTime>=this.refreshRate&&(this.updateCurrentTime(),this.refreshLastTime=e),this.animationFrameId=window.requestAnimationFrame(this.startUpdateLoop)},stopUpdateLoop:function(){this.updateCurrentTime(),window.cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null},updateCurrentTime:function(){this.currentTime=this.video.currentTime,this.currentTimeDate.setTime(1e3*this.currentTime),this.currentTimeString=this.currentTimeDate.toISOString().split("T")[1].slice(0,-1)},setDuration:function(){this.duration=this.video.duration},emitSeek:function(e){this.$emit("seek",e)},emitSelect:function(e,t){this.$emit("select",e,t)},emitDeselect:function(){this.$emit("deselect")},handleScrollY:function(e){this.scrollTop=e},getAnnotationTrackLanes:function(e){var t=[[]],n=[[]];return e.forEach(function(e){var i=[e.frames[0],e.frames[e.frames.length-1]],o=0,a=!1;e:for(;!a;){if(n[o]){for(var r=t[o].length-1;r>=0;r--)if(this.rangesCollide(t[o][r],i)){o+=1;continue e}}else t[o]=[],n[o]=[];t[o].push(i),n[o].push(e),a=!0}},this),n},rangesCollide:function(e,t){return e[0]>=t[0]&&e[0]<t[1]||e[1]>t[0]&&e[1]<=t[1]||t[0]>=e[0]&&t[0]<e[1]||t[1]>e[0]&&t[1]<=e[1]||e[0]===t[0]&&e[1]===t[1]}},watch:{},created:function(){this.video.addEventListener("play",this.startUpdateLoop),this.video.addEventListener("pause",this.stopUpdateLoop),this.video.addEventListener("loadedmetadata",this.setDuration),this.video.addEventListener("seeked",this.updateCurrentTime)},mounted:function(){}}),biigle.$declare("videos.api.videoAnnotations",Vue.resource("api/v1/video-annotations{/id}",{},{query:{method:"GET",url:"api/v1/videos{/id}/annotations"},save:{method:"POST",url:"api/v1/videos{/id}/annotations"}})),biigle.$component("videos.components.videoScreen.annotationPlayback",function(){return{data:function(){return{renderedAnnotationMap:{}}},computed:{annotationLength:function(){return this.annotations.length},annotationsPreparedToRender:function(){return this.annotations.map(function(e){return{id:e.id,start:e.frames[0],end:e.frames[e.frames.length-1],self:e}}).sort(function(e,t){return e.start-t.start})},preparedInterpolationPoints:function(){var e={};return this.annotations.forEach(function(t){e[t.id]=this.prepareInterpolationPoints(t)},this),e}},methods:{refreshAnnotations:function(e){var t=this.annotationSource,n=this.selectedFeatures,i=this.annotationsPreparedToRender,o=this.renderedAnnotationMap,a={};this.renderedAnnotationMap=a;for(var r,s=[],c=!1,l=0,d=i.length;l<d;l++)if(!(i[l].end<=e&&i[l].start!==e)){if(i[l].start>e)break;r=i[l],c=!0,o.hasOwnProperty(r.id)?(a[r.id]=o[r.id],delete o[r.id]):s.push(r.self)}c?Object.values(o).forEach(function(e){t.removeFeature(e),n.remove(e)}):(t.clear(),n.clear());var u=s.map(this.createFeature);u.forEach(function(e){a[e.getId()]=e,!1!==e.get("annotation").selected&&n.push(e)}),u.length>0&&t.addFeatures(u),Object.values(a).forEach(function(t){this.updateGeometry(t,e)},this)},createFeature:function(e){var t=new ol.Feature(this.getGeometryFromPoints(e.shape,e.points[0]));return t.setId(e.id),t.set("annotation",e),e.labels&&e.labels.length>0&&t.set("color",e.labels[0].label.color),t},updateGeometry:function(e,t){var n=e.get("annotation"),i=n.frames;if(!(i.length<=1)){var o;for(o=i.length-1;o>=0&&!(i[o]<=t);o--);var a=(t-i[o])/(i[o+1]-i[o]);e.setGeometry(this.getGeometryFromPoints(n.shape,this.interpolatePoints(n,o,a)))}},prepareInterpolationPoints:function(e){switch(e.shape){case"Rectangle":case"Ellipse":return e.points.map(this.rectangleToInterpolationPoints);case"LineString":case"Polygon":return e.points.map(this.polygonToSvgPath);default:return e.points}},polygonToSvgPath:function(e){return e=e.slice(),e.unshift("M"),e.splice(3,0,"L"),e.join(" ")},interpolatePoints:function(e,t,n){var i=this.preparedInterpolationPoints[e.id],o=i[t],a=i[t+1];switch(e.shape){case"Rectangle":case"Ellipse":return this.interpolationPointsToRectangle(this.interpolateNaive(o,a,n));case"LineString":case"Polygon":return this.interpolatePolymorph(o,a,n);default:return this.interpolateNaive(o,a,n)}},interpolateNaive:function(e,t,n){return e.map(function(e,i){return e+(t[i]-e)*n})},interpolatePolymorph:function(e,t,n){return polymorph.interpolate([e,t])(n).replace(/[MCL\s]+/g," ").trim().split(" ").map(function(e){return parseInt(e,10)})},rectangleToInterpolationPoints:function(e){var t=[e[2]-e[0],e[3]-e[1]],n=[e[6]-e[0],e[7]-e[1]],i=Math.sqrt(n[0]*n[0]+n[1]*n[1]),o=Math.sqrt(t[0]*t[0]+t[1]*t[1]),a=[t[0]/o,t[1]/o],r=[(e[0]+e[2]+e[4]+e[6])/4,(e[1]+e[3]+e[5]+e[7])/4];return[r[0],r[1],a[0],a[1],i,o]},interpolationPointsToRectangle:function(e){var t=[e[2],e[3]],n=[-t[1],t[0]],i=e[4]/2*n[0],o=e[4]/2*n[1],a=e[5]/2*t[0],r=e[5]/2*t[1];return[e[0]-a-i,e[1]-r-o,e[0]+a-i,e[1]+r-o,e[0]+a+i,e[1]+r+o,e[0]-a+i,e[1]-r+o]},getGeometryFromPoints:function(e,t){switch(t=this.convertPointsFromDbToOl(t),e){case"Point":return new ol.geom.Point(t[0]);case"Rectangle":return new ol.geom.Rectangle([t]);case"Polygon":return new ol.geom.Polygon([t]);case"LineString":return new ol.geom.LineString(t);case"Circle":return new ol.geom.Circle(t[0],t[1][0]);case"Ellipse":return new ol.geom.Ellipse([t]);default:return void console.error("Unknown annotation shape: "+e)}},getPointsFromGeometry:function(e){var t;switch(e.getType()){case"Circle":t=[e.getCenter(),[e.getRadius()]];break;case"Polygon":case"Rectangle":case"Ellipse":t=e.getCoordinates()[0];break;case"Point":t=[e.getCoordinates()];break;default:t=e.getCoordinates()}return this.convertPointsFromOlToDb(t)},invertPointsYAxis:function(e){for(var t=this.videoCanvas.height,n=1;n<e.length;n+=2)e[n]=t-e[n];return e},convertPointsFromOlToDb:function(e){return this.invertPointsYAxis(Array.prototype.concat.apply([],e))},convertPointsFromDbToOl:function(e){e=this.invertPointsYAxis(e.slice());for(var t=[],n=0;n<e.length;n+=2)t.push([e[n],e[n+1]||0]);return t}},watch:{},created:function(){this.$on("refresh",this.refreshAnnotations),this.$once("map-ready",function(){this.$watch("annotationLength",function(){this.refreshAnnotations(this.video.currentTime)})})}}}),biigle.$component("videos.components.videoScreen.videoPlayback",function(){return{data:function(){return{playing:!1,animationFrameId:null,refreshRate:30,refreshLastTime:Date.now()}},computed:{},methods:{initVideoLayer:function(e){var t=e[0];this.videoCanvas.width=this.video.videoWidth,this.videoCanvas.height=this.video.videoHeight;var n=[0,0,this.videoCanvas.width,this.videoCanvas.height],i=new ol.proj.Projection({code:"biigle-image",units:"pixels",extent:n});this.videoLayer=new ol.layer.Image({map:t,source:new ol.source.Canvas({canvas:this.videoCanvas,projection:i,canvasExtent:n,canvasSize:[n[0],n[1]]})}),t.setView(new ol.View({projection:i,minResolution:.25,extent:n})),t.getView().fit(n)},renderVideo:function(){this.videoCanvasCtx.drawImage(this.video,0,0,this.video.videoWidth,this.video.videoHeight),this.videoLayer.changed();var e=Date.now();e-this.refreshLastTime>=this.refreshRate&&(this.$emit("refresh",this.video.currentTime),this.refreshLastTime=e)},startRenderLoop:function(){this.renderVideo(),this.animationFrameId=window.requestAnimationFrame(this.startRenderLoop)},stopRenderLoop:function(){window.cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null},setPlaying:function(){this.playing=!0},setPaused:function(){this.playing=!1},togglePlaying:function(){this.playing?this.pause():this.play()},play:function(){this.video.play()},pause:function(){this.video.pause()},emitMapReady:function(){this.$emit("map-ready",this.map)}},watch:{playing:function(e){e&&!this.animationFrameId?this.startRenderLoop():e||this.stopRenderLoop()}},created:function(){this.videoCanvas=document.createElement("canvas"),this.videoCanvasCtx=this.videoCanvas.getContext("2d"),this.video.addEventListener("play",this.setPlaying),this.video.addEventListener("pause",this.setPaused),this.video.addEventListener("seeked",this.renderVideo),this.video.addEventListener("loadeddata",this.renderVideo);var e=this,t=new Vue.Promise(function(t,n){e.$once("map-created",t)}),n=new Vue.Promise(function(t,n){e.video.addEventListener("loadedmetadata",t),e.video.addEventListener("error",n)});Vue.Promise.all([t,n]).then(this.initVideoLayer).then(this.emitMapReady),biigle.$require("keyboard").on(" ",this.togglePlaying)}}});