$(".toggle-buttons > .m-btn").live("click", function() {
    $(this).siblings(".m-btn").removeClass("active");
    $(this).addClass("active");
});
