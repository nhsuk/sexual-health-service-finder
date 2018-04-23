function trackClick(element, arg1, arg2) {
  Webtrends.multiTrack({
    element: element,
    argsa: [arg1, arg2, 'WT.dl', '121']
  });
}

var trackingName = 'DCSext.Chlamydia';

$('.conditions_page_tracking').on('click', function () {
  trackClick($(this), trackingName, 'ChlamydiaConditionsPage');
});

$('.nhsuk_privacy_policy_tracking').on('click', function () {
  trackClick($(this), trackingName, 'NHSUKPrivacyPolicy');
});

$('.start_button_tracking').on('click', function () {
  trackClick($(this), trackingName, 'StartButton');
});

$('.england_helpline_tracking').on('click', function () {
  trackClick($(this), trackingName, 'EnglandSexualHealthHelpline');
});

$('.scotland_information_tracking').on('click', function () {
  trackClick($(this), trackingName, 'ScotlandInformation');
});

$('.scotland_finder_tracking').on('click', function () {
  trackClick($(this), trackingName, 'ScotlandSexualHealthServiceFinder');
});

$('.scotland_helpline_tracking').on('click', function () {
  trackClick($(this), trackingName, 'ScotlandSexualHealthHelpline');
});

$('.wales_information_tracking').on('click', function () {
  trackClick($(this), trackingName, 'WalesInformation');
});

$('.wales_nhsdirect_tracking').on('click', function () {
  trackClick($(this), trackingName, 'WalesNHSDirectWebsite');
});

$('.wales_nhsdirect_helpline_tracking').on('click', function () {
  trackClick($(this), trackingName, 'WalesNHSDirectHelpline');
});

$('.northern_ireland_information_tracking').on('click', function () {
  trackClick($(this), trackingName, 'NorthernIrelandInformation');
});

$('.northern_ireland_website_tracking').on('click', function () {
  trackClick($(this), trackingName, 'NorthernIrelandSexualHealthWebsite');
});

$('.northern_ireland_helpline_tracking').on('click', function () {
  trackClick($(this), trackingName, 'NorthernIrelandSexualHealthHelpline');
});

$('.about_free_test_kits_tracking').on('click', function () {
  trackClick($(this), trackingName, 'AboutFreeTestKits');
});

$('.about_free_test_kits_online_tracking').on('click', function () {
  trackClick($(this), trackingName, 'AboutFreeTestKitsOnline');
});

$('.about_sexual_health_professionals_tracking').on('click', function () {
  trackClick($(this), trackingName, 'AboutSexualHealthProfessionals');
});

$('.about_test_kits_tracking').on('click', function () {
  trackClick($(this), trackingName, 'AboutTestKits');
});

$('.telephone_tracking').on('click', function () {
  trackClick($(this), trackingName, 'ResultTelephoneNumber');
});

$('.maps_tracking').on('click', function () {
  trackClick($(this), trackingName, 'SeeMapDirections');
});

$('.opening_times_tracking').on('click', function () {
  trackClick($(this), trackingName, 'SeeOpeningTimes');
});

$('.service_information_tracking').on('click', function () {
  trackClick($(this), trackingName, 'SeeServiceInformation');
});

$('.find_free_kit_online_tracking').on('click', function () {
  trackClick($(this), trackingName, 'FindFreeTestKitOnline');
});

$('.find_sexual_health_professional_tracking').on('click', function () {
  trackClick($(this), trackingName, 'SexualHealthProfessional');
});

$('.collect_free_kit_tracking').on('click', function () {
  trackClick($(this), trackingName, 'CollectFreeTestKit');
});

$('.buy_kit_tracking').on('click', function () {
  trackClick($(this), trackingName, 'BuyTestKit');
});
