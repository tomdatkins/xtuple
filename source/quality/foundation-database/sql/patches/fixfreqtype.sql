UPDATE xt.qpheadass SET qpheadass_freqtype=CASE WHEN qpheadass_freqtype='O' THEN 'LOT'
                                                WHEN qpheadass_freqtype='E' THEN 'SER'
                                                ELSE qpheadass_freqtype END;
