angular.module("dias.transects.edit",["dias.api","dias.ui.messages"]),angular.module("dias.transects.edit").config(["$compileProvider",function(e){"use strict";e.debugInfoEnabled(!1)}]),angular.module("dias.transects.edit").factory("TransectUser",["$resource","URL",function(e,s){"use strict";return e(s+"/api/v1/transects/:transect_id/users")}]),angular.module("dias.transects.edit").controller("AnnotationSessionController",["$scope","AnnotationSession","TRANSECT_ID","ANNOTATION_SESSIONS","msg","TransectUser",function(e,s,n,t,a,i){"use strict";var r,o=!1,d=!1,c={},u=new Date,f=function(s){t.push(S(s)),e.clearNewSession(),d=!1},l=function(){for(var s=t.length-1;s>=0;s--)if(t[s].id===e.newSession.id){t[s]=e.newSession,t[s].users=e.sessionUsers;break}e.clearNewSession(),d=!1},g=function(s){400===s.status?(confirm(s.data.message+" Use the Force and update the annotation session?")&&e.submit(!0),d=!1):(c=s.data,d=!1)},m=function(e){c=e.data,d=!1},_=function(){for(var s=t.length-1;s>=0;s--)if(t[s].id===e.newSession.id){t.splice(s,1);break}e.clearNewSession(),d=!1},w=function(s){400===s.status?(confirm(s.data.message+" Use the Force and delete the annotation session?")&&e.deleteSession(!0),d=!1):(a.responseError(s),d=!1)},p=function(){c={}},S=function(e){return e.starts_at=new Date(e.starts_at),e.starts_at_iso8601=new Date(e.starts_at_iso8601),e.ends_at=new Date(e.ends_at),e.ends_at_iso8601=new Date(e.ends_at_iso8601),e},y=function(s){for(var n=e.sessionUsers.length-1;n>=0;n--)if(e.sessionUsers[n].id===s.id)return!0;return!1},v={name:null,description:null,starts_at_iso8601:null,ends_at_iso8601:null,hide_other_users_annotations:!1,hide_own_annotations:!1,users:[]};e.formats=["dd-MMMM-yyyy","yyyy/MM/dd","dd.MM.yyyy"],e.open={starts_at:!1,ends_at:!1},e.newSession=angular.copy(v),e.sessionUsers=[],e.selected={user:""},e.confirm=function(){return confirm.apply(window,arguments)},e.isEditing=function(){return o},e.isLoading=function(){return d},e.toggleEditing=function(){o=!o,o||e.clearNewSession(),void 0===r&&(r=i.query({transect_id:n}))},e.openStartsAt=function(){e.open.starts_at=!0,e.open.ends_at=!1},e.openEndsAt=function(){e.open.ends_at=!0,e.open.starts_at=!1},e.hasError=function(e){return c.hasOwnProperty(e)},e.getError=function(s){if(e.hasError(s))return c[s][0]},e.hasSessions=function(){return t.length>0},e.getSessions=function(){return t},e.isActive=function(e){return e.starts_at_iso8601<u&&e.ends_at_iso8601>=u},e.dateComparator=function(e){return e.starts_at_iso8601.getTime()},e.submit=function(t){if(p(),d=!0,e.newSession.starts_at=e.newSession.starts_at_iso8601,e.newSession.ends_at=e.newSession.ends_at_iso8601,e.newSession.users=e.sessionUsers.map(function(e){return e.id}),e.newSession.id){var a={};t&&(a.force=1),s.save(a,e.newSession,l,g)}else s.create({transect_id:n},e.newSession,f,m)},e.deleteSession=function(n){d=!0;var t={id:e.newSession.id};n&&(t.force=1),s.delete(t,_,w)},e.clearNewSession=function(){p(),e.newSession=angular.copy(v),e.sessionUsers=[],e.selected.user=""},e.editSession=function(s){e.newSession=angular.copy(s),e.sessionUsers=e.newSession.users},e.getTransectUsers=function(){return r},e.addUser=function(s,n){s.preventDefault(),y(n)||e.sessionUsers.push(n),e.selected.user=""},e.removeUser=function(s){for(var n=e.sessionUsers.length-1;n>=0;n--)e.sessionUsers[n].id===s.id&&e.sessionUsers.splice(n,1)},t.forEach(S)}]),angular.module("dias.transects.edit").controller("ImagesController",["$scope","$element","Image","TransectImage","TRANSECT_ID","msg",function(e,s,n,t,a,i){"use strict";var r={confirm:s.attr("data-confirmation"),success:s.attr("data-success")};e.data={addingNewImages:!1,filenames:"",newImages:[]};var o=function(s){var n=document.getElementById("transect-image-"+s);if(n)n.remove();else for(var t=e.data.newImages.length-1;t>=0;t--)if(e.data.newImages[t].id===s){e.data.newImages.splice(t,1);break}};e.deleteImage=function(e,s){var t=r.confirm.replace(":img","#"+e+" ("+s+")");confirm(t)&&n.delete({id:e},function(){o(e),i.success(r.success)},i.responseError)},window.$diasTransectsEditDeleteImage=function(s,n){e.$apply(function(){e.deleteImage(s,n)})},e.toggleAddingNewImage=function(){e.data.addingNewImages=!e.data.addingNewImages},e.addNewImages=function(){var s=t.save({transect_id:a},{images:e.data.filenames},function(){Array.prototype.push.apply(e.data.newImages,s),e.data.filenames=""},i.responseError)}}]);