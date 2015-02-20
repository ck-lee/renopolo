var cks = cks || {};
cks.viewMediators = cks.viewMediators || {};
cks.viewMediators.post = function (postVm, map, geoLocation, tracer) {
    //cks.fileupload();
    $('#floorplanButtonGroup a').live("click", function (e) {
        e.stopImmediatePropagation();
    });
    var _$content = $("div#post-content");
    ko.applyBindings(postVm, _$content.find("div#plan-view")[0]);
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            tracer.loadUserBackground(data.result.url).done(function () {
                postVm.traceEstimateVm.floorPlanUrl(data.result.url);
                postVm.traceEstimateVm.tracerSectionIsVisible(true);
                postVm.traceEstimateVm.wallSectionIsVisible(true);
                postVm.traceEstimateVm.isUploadingFloorPlan(false);
                postVm.traceEstimateVm.floorPlanIsUploaded(true);
                postVm.wallsVm.sectionId(data.result.sectionId);
            });
        },
        formData: function() {
            return [{ "name": "sectionId", "value" : postVm.wallsVm.sectionId() }];
        }
    });
    $('#fileupload').on("change", function () {
        postVm.traceEstimateVm.isUploadingFloorPlan(true);
        // Remove any previous file names
        $('#fileuploading-span').next('.file-input-name').remove();
        if ($(this).prop('files').length > 1) {
            $('#fileuploading-span').after('<span class="file-input-name">' + $(this)[0].files.length + ' files</span>');
        }
        else {
            $('#fileuploading-span').after('<span class="file-input-name">' + $(this).val().replace('C:\\fakepath\\', '') + '</span>');
        }
    });
    cks.bootstrapFileInput();

    var _top = $('#post-preview').offset().top - parseFloat($('#post-preview').css('marginTop').replace(/auto/, 0));
    $(window).scroll(function (event) {
        // what the y position of the scroll is
        var _y = $(this).scrollTop();

        // whether that's below the form
        if (_y >= 300) {
            // if so, ad the fixed class
            $('#post-preview').addClass('fixed');
        } else {
            // otherwise remove it
            $('#post-preview').removeClass('fixed');
        }
    });

};