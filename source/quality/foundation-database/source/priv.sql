DO $$
  DECLARE
    _nameDesc TEXT[] := ARRAY[
      [ 'MaintainQualityPlans',             'Maintain Quality Plans'               ],
      [ 'MaintainQualityPlanTypes',         'Maintain Quality Plan Types'          ],      
      [ 'ViewQualityPlans',                 'View Quality Plans'                   ],
      [ 'MaintainQualityTests',             'Maintain Quality Tests'               ],
      [ 'ViewQualityTests',                 'View Quality Tests'                   ],
      [ 'ReleaseQualityTests',              'Release Quality Tests'                ],
      [ 'CancelQualityTest',                'Can manually cancel Quality Tests'    ],
      [ 'DeleteQualityTests',               'Delete Quality Tests'                 ],
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
