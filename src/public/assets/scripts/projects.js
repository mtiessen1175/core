angular.module("biigle.projects").controller("ProjectVolumeController",["$scope","$element","$uibModal","ProjectVolume","msg",function(e,t,n,o,r){"use strict";var c=function(){var e=n.open({templateUrl:"confirmDeleteVolumeModal.html",size:"sm"});return e},i=function(){e.removeVolume(e.$index)},s=function(t){400===t.status?c().result.then(function(t){"force"==t?e.remove(!0):e.cancelRemove()}):r.responseError(t)};e.startRemove=function(){e.removing=!0},e.cancelRemove=function(){e.removing=!1},e.remove=function(t){var n;n=t?{project_id:e.projectId,force:!0}:{project_id:e.projectId},o.detach(n,{id:e.volume.id},i,s)},e.$watch("editing",function(t){t||e.cancelRemove()})}]),angular.module("biigle.projects").controller("ProjectVolumesController",["$scope","ProjectVolume",function(e,t){"use strict";e.volumes=t.query({project_id:e.projectId}),e.edit=function(){e.editing=!e.editing},e.removeVolume=function(t){e.volumes.splice(t,1)},e.$watchCollection("volumes",function(t){t&&0===t.length&&(e.editing=!1)})}]);
