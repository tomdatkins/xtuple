DO $$
  DECLARE
    _nameDesc TEXT[] := ARRAY[
      [ 'MaintainQualityPlans',             'Maintain Quality Control Plans'       ],
      [ 'ViewQualityPlans',                 'View Quality Control Plans'           ],
      [ 'MaintainQualityPlanEmailProfiles', 'Maintain Quality Control Plan Email Profiles' ],
      [ 'MaintainQualityTests',             'Maintain Quality Control Tests'       ],
      [ 'ViewQualityTests',                 'View Quality Control Tests'           ],
      [ 'ReleaseQualityTests',              'Release Quality Control Tests'        ],
      [ 'CancelQualityTest',                'Can manually cancel Quality Tests'    ],
      [ 'DeleteQualityTests',               'Delete Quality Control Tests'         ],
      [ 'MaintainQualitySpecs',             'Maintain Quality Test Specifications' ],
      [ 'ViewQualitySpecs',                 'View Quality Test Specifications'     ]
    ];
    _pair TEXT[];

  BEGIN
    FOREACH _pair SLICE 1 IN ARRAY _nameDesc LOOP
      PERFORM grantPrivGroup(grp_id,
                             createPriv('Quality', _pair[1], _pair[2], NULL,
                                        'xtquality'))
         FROM grp
        WHERE grp_name = 'ADMIN';
    END LOOP;
  END;
$$ LANGUAGE plpgsql;
