((global) => {
  const $ = global.jQuery;
  const trackingRef = 'DCSext.Chlamydia';

  const selectors = [
    { selector: '.conditions_page_tracking', text: 'ChlamydiaConditionsPage' },
    { selector: '.nhsuk_privacy_policy_tracking', text: 'NHSUKPrivacyPolicy' },
    { selector: '.start_button_tracking', text: 'StartButton' },
    { selector: '.england_helpline_tracking', text: 'EnglandSexualHealthHelpline' },
    { selector: '.scotland_information_tracking', text: 'ScotlandInformation' },
    { selector: '.scotland_finder_tracking', text: 'ScotlandSexualHealthServiceFinder' },
    { selector: '.scotland_helpline_tracking', text: 'ScotlandSexualHealthHelpline' },
    { selector: '.wales_information_tracking', text: 'WalesInformation' },
    { selector: '.wales_nhsdirect_tracking', text: 'WalesNHSDirectWebsite' },
    { selector: '.wales_nhsdirect_helpline_tracking', text: 'WalesNHSDirectHelpline' },
    { selector: '.northern_ireland_information_tracking', text: 'NorthernIrelandInformation' },
    { selector: '.northern_ireland_website_tracking', text: 'NorthernIrelandSexualHealthWebsite' },
    { selector: '.northern_ireland_helpline_tracking', text: 'NorthernIrelandSexualHealthHelpline' },
    { selector: '.about_free_test_kits_tracking', text: 'AboutFreeTestKits' },
    { selector: '.about_free_test_kits_online_tracking', text: 'AboutFreeTestKitsOnline' },
    { selector: '.about_sexual_health_professionals_tracking', text: 'AboutSexualHealthProfessionals' },
    { selector: '.about_test_kits_tracking', text: 'AboutTestKits' },
    { selector: '.telephone_tracking', text: 'ResultTelephoneNumber' },
    { selector: '.maps_tracking', text: 'SeeMapDirections' },
    { selector: '.opening_times_tracking', text: 'SeeOpeningTimes' },
    { selector: '.service_information_tracking', text: 'SeeServiceInformation' },
    { selector: '.find_free_kit_online_tracking', text: 'FindFreeTestKitOnline' },
    { selector: '.find_sexual_health_professional_tracking', text: 'SexualHealthProfessional' },
    { selector: '.collect_free_kit_tracking', text: 'CollectFreeTestKit' },
    { selector: '.buy_kit_tracking', text: 'BuyTestKit' },
  ];

  $.each(selectors, (index, val) => {
    $(val.selector).on('touchstart click', () => {
      if (global.Webtrends) {
        global.Webtrends.multiTrack({ argsa: [trackingRef, val.text, 'WT.dl', '121'] });
      }
    });
  });
})(window);
