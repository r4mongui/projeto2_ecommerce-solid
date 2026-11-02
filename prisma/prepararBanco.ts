import { closeSync, openSync } from 'node:fs';
import { join } from 'node:path';

// Abre sem truncar: preserva bancos existentes e prepara instalações novas.
closeSync(openSync(join(__dirname, 'dev.db'), 'a'));
