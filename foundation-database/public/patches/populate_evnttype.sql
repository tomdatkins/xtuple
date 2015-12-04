INSERT INTO eventtype (evnttype_name, envttype_descrip, evnttype_module)
               VALUES ('QuoteConvertedToSO', 'Converted a Quote to a Sales Order', 'S/O')
       WHERE NOT EXISTS (SELECT 1 FROM evnttype WHERE evnttype_name = 'QuoteConvertedToSO');

INSERT INTO eventtype (evnttype_name, envttype_descrip, evnttype_module)
               VALUES ('QuoteConvertedToInvoice', 'Converted a Quote to an Invoice', 'S/O')
       WHERE NOT EXISTS (SELECT 1 FROM evnttype WHERE evnttype_name = 'QuoteConvertedToInvoice');
