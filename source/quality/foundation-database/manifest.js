{
  "name":          "quality_foundation",
  "version":       "1.1.0",
  "comment":       "Quality Control foundation",
  "loadOrder":     2020,
  "defaultSchema": "xtquality",
  "databaseScripts": [
    "sql/update_version.sql",
    "source/xt/tables/qspec.sql",
    "source/xt/tables/qspectype.sql",
    "source/xt/tables/qplantype.sql",    
    "source/xt/tables/qphead.sql",
    "source/xt/tables/qpitem.sql",
    "source/xt/tables/qpheadass.sql",
    "source/xt/tables/qthead.sql",
    "source/xt/tables/qtitem.sql",
    "source/xt/tables/qtrlscode.sql",
    "source/xt/tables/qtrsncode.sql",
    "source/xt/tables/qplanemlprofile.sql",

    "source/xt/tables/qualityplanwf.sql",
    "source/xt/tables/qualitytestwf.sql",
    "source/xt/tables/wftype.sql",
    "source/xt/tables/acttype.sql",
                    
    "source/xt/trigger_functions/qphead_trigger.sql",
    "source/xt/trigger_functions/qthead_trigger.sql",
    "source/xt/trigger_functions/qtitem_trigger.sql",
    "source/xt/trigger_functions/inv_hist_did_change.sql",
    "source/xt/trigger_functions/inv_detail_did_change.sql",
    "source/xt/trigger_functions/triggerwooperquality.sql",
    "source/public/tables/invhist.sql",
    "source/public/tables/invdetail.sql",
    "source/public/tables/wooper.sql",
    "source/xt/functions/quality.sql",
    "source/xt/functions/createqualitytestfromplan.sql",
    "source/xt/functions/createqualityplanrevision.sql",
    "source/xt/functions/quality_comment_type.sql",
    "source/xt/functions/formatqualityitemnumber.sql",
    "sql/qthead_doctype.sql",
    "source/priv.sql",

    "source/xtquality/tables/pkguiform/qplan.ui",
    "source/xtquality/tables/pkguiform/qplantypes.ui",
    "source/xtquality/tables/pkguiform/qplantype.ui",        
    "source/xtquality/tables/pkguiform/qplanass.ui",
    "source/xtquality/tables/pkguiform/qreasoncode.ui",
    "source/xtquality/tables/pkguiform/qreasoncodes.ui",
    "source/xtquality/tables/pkguiform/qreleasecode.ui",
    "source/xtquality/tables/pkguiform/qreleasecodes.ui",
    "source/xtquality/tables/pkguiform/qspec.ui",
    "source/xtquality/tables/pkguiform/qspectype.ui",
    "source/xtquality/tables/pkguiform/qspectypes.ui",
    "source/xtquality/tables/pkguiform/qtconfig.ui",
    "source/xtquality/tables/pkguiform/qtest.ui",
    "source/xtquality/tables/pkguiform/qtitem.ui",

    "source/xtquality/tables/pkgscript/xtQuality.js",
    "source/xtquality/tables/pkgscript/qplan.js",
    "source/xtquality/tables/pkgscript/qplanass.js",
    "source/xtquality/tables/pkgscript/qplans.js",
    "source/xtquality/tables/pkgscript/qplantypes.js",
    "source/xtquality/tables/pkgscript/qplantype.js",        
    "source/xtquality/tables/pkgscript/qreasoncode.js",
    "source/xtquality/tables/pkgscript/qreasoncodes.js",
    "source/xtquality/tables/pkgscript/qreleasecode.js",
    "source/xtquality/tables/pkgscript/qreleasecodes.js",
    "source/xtquality/tables/pkgscript/qspec.js",
    "source/xtquality/tables/pkgscript/qspecs.js",
    "source/xtquality/tables/pkgscript/qspectype.js",
    "source/xtquality/tables/pkgscript/qspectypes.js",
    "source/xtquality/tables/pkgscript/qtconfig.js",
    "source/xtquality/tables/pkgscript/qtest.js",
    "source/xtquality/tables/pkgscript/qtests.js",
    "source/xtquality/tables/pkgscript/qtitem.js",
    "source/xtquality/tables/pkgscript/setup.js",
    "source/xtquality/tables/pkgscript/initMenu.js",
    "source/xtquality/tables/pkgscript/qualityTests.js",

    "source/xtquality/tables/pkgmetasql/qpheadass-detail.mql",
    "source/xtquality/tables/pkgmetasql/qplan-detail.mql",
    "source/xtquality/tables/pkgmetasql/qspec-detail.mql",
    "source/xtquality/tables/pkgmetasql/qtest-detail.mql",
    "source/xtquality/tables/pkgmetasql/qtitem-detail.mql",
    "source/xtquality/tables/pkgmetasql/qualityTests-detail.mql",
    "source/xtquality/tables/pkgmetasql/qualityTests-summary.mql",

    "source/xtquality/tables/pkgreport/QualityCertificate.xml",
    "source/xtquality/tables/pkgreport/QualityNonConformance.xml",
    "source/xtquality/tables/pkgreport/QualityTest.xml",
    "source/xtquality/tables/pkgreport/QualitySpecs.xml",
    "source/xtquality/tables/pkgreport/QualityPlans.xml",        
    "source/xtquality/tables/pkgreport/QualityTestSummary.xml",
    "source/xtquality/tables/pkgreport/WorkOrderQualityCertificate.xml"
  ]
}
