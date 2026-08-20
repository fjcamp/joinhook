const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseUrl = process.env.BROWSER_QA_BASE_URL || 'http://127.0.0.1:3002';
const artifactsDir = path.resolve('artifacts/browser-qa');
fs.mkdirSync(artifactsDir, { recursive: true });

function selectOptionContaining(select, text) {
    return select.locator('option').allTextContents().then(async (labels) => {
        const index = labels.findIndex((label) => label.includes(text));
        assert.notEqual(index, -1, `No se encontró opción que contenga: ${text}`);
        const value = await select.locator('option').nth(index).getAttribute('value');
        assert.ok(value, `La opción ${text} no tiene value`);
        await select.selectOption(value);
    });
}

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        acceptDownloads: true,
        locale: 'es-CL'
    });
    const page = await context.newPage();
    const browserErrors = [];

    page.on('pageerror', (error) => browserErrors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
        if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`);
    });

    try {
        await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
        assert.match(await page.title(), /JoinHook/i);
        await page.locator('h1').first().waitFor({ state: 'visible' });
        await page.screenshot({ path: path.join(artifactsDir, 'home-desktop.png'), fullPage: true });

        await page.goto(`${baseUrl}/app/control-gastronomico-express/`, { waitUntil: 'networkidle' });

        const onboarding = page.getByRole('dialog', { name: 'Prepara tu espacio' });
        await onboarding.waitFor({ state: 'visible' });
        await onboarding.getByPlaceholder('Ej. Cafetería del Lago').fill('Cafetería QA JoinHook');
        await onboarding.getByRole('button', { name: /Crear espacio en blanco/ }).click();
        await page.getByText('Cafetería QA JoinHook', { exact: true }).first().waitFor({ state: 'visible' });

        const newSupplierButton = page.getByRole('button', { name: /Nuevo proveedor/ });
        await newSupplierButton.click();
        let dialog = page.getByRole('dialog', { name: 'Nuevo proveedor' });
        await dialog.waitFor({ state: 'visible' });
        assert.equal(
            await dialog.getByRole('button', { name: 'Cerrar' }).evaluate((element) => element === document.activeElement),
            true,
            'El modal debe mover el foco a un control interno al abrirse'
        );
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'hidden' });

        await newSupplierButton.click();
        dialog = page.getByRole('dialog', { name: 'Nuevo proveedor' });
        await dialog.getByLabel('Nombre comercial').fill('Proveedor QA');
        await dialog.getByLabel('Persona de contacto').fill('Persona QA');
        await dialog.getByLabel('Correo').fill('qa@example.com');
        await dialog.getByRole('button', { name: 'Guardar proveedor' }).click();
        await page.getByText(/Proveedor QA: proveedor guardado/).waitFor({ state: 'visible' });

        await page.getByRole('button', { name: /Nuevo producto/ }).click();
        dialog = page.getByRole('dialog', { name: 'Nuevo producto' });
        await dialog.getByLabel('Nombre').fill('Harina QA');
        await dialog.getByLabel('Categoría').fill('Secos');
        await dialog.getByLabel('Unidad').selectOption('kg');
        await dialog.getByLabel('Stock inicial').fill('10');
        await dialog.getByLabel('Stock mínimo').fill('5');
        await dialog.getByLabel('Costo unitario').fill('1000');
        await selectOptionContaining(dialog.locator('select[name="supplierId"]'), 'Proveedor QA');
        await dialog.getByRole('button', { name: 'Guardar producto' }).click();
        await page.getByText(/Harina QA: producto agregado/).waitFor({ state: 'visible' });

        await page.getByRole('button', { name: /Registrar compra/ }).first().click();
        dialog = page.getByRole('dialog', { name: 'Registrar compra' });
        await selectOptionContaining(dialog.locator('select[name="productId"]'), 'Harina QA');
        await dialog.getByLabel('Cantidad').fill('5');
        await dialog.getByLabel('Costo unitario').fill('1100');
        await dialog.getByRole('button', { name: 'Registrar y sumar stock' }).click();
        await page.getByText(/Harina QA: compra registrada/).waitFor({ state: 'visible' });

        await page.getByRole('button', { name: 'Registrar merma' }).click();
        dialog = page.getByRole('dialog', { name: 'Registrar merma' });
        await selectOptionContaining(dialog.locator('select[name="productId"]'), 'Harina QA');
        await dialog.getByLabel('Cantidad').fill('2');
        await dialog.getByLabel('Causa').selectOption({ label: 'Preparación' });
        await dialog.getByRole('button', { name: 'Registrar y descontar stock' }).click();
        await page.getByText(/Harina QA: merma registrada/).waitFor({ state: 'visible' });

        await page.locator('.cge-sidebar nav button').filter({ hasText: 'Inventario' }).click();
        let row = page.locator('.cge-table tbody tr').filter({ hasText: 'Harina QA' });
        await row.waitFor({ state: 'visible' });
        assert.match(await row.innerText(), /13\s*kg/);
        await row.getByRole('button', { name: 'Ajustar' }).click();

        dialog = page.getByRole('dialog', { name: 'Ajustar Harina QA' });
        await dialog.getByLabel('Nuevo stock').fill('12');
        await dialog.getByLabel('Motivo del ajuste').fill('Conteo físico QA');
        await dialog.getByRole('button', { name: 'Guardar ajuste' }).click();
        await page.getByText(/Harina QA: stock ajustado/).waitFor({ state: 'visible' });
        row = page.locator('.cge-table tbody tr').filter({ hasText: 'Harina QA' });
        assert.match(await row.innerText(), /12\s*kg/);

        await page.locator('.cge-sidebar nav button').filter({ hasText: 'Respaldo' }).click();
        await page.getByText('Respalda antes de cambiar de dispositivo.').waitFor({ state: 'visible' });

        const [backupDownload] = await Promise.all([
            page.waitForEvent('download'),
            page.getByRole('button', { name: /Descargar respaldo/ }).click()
        ]);
        assert.match(backupDownload.suggestedFilename(), /^control-gastronomico-express-\d{4}-\d{2}-\d{2}\.json$/);
        const backupPath = await backupDownload.path();
        assert.ok(backupPath, 'El respaldo JSON no generó archivo descargable');
        const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        assert.equal(backup.businessName, 'Cafetería QA JoinHook');
        assert.equal(backup.products.find((item) => item.name === 'Harina QA')?.stock, 12);

        const csvInput = page.locator('input[type="file"][accept*="csv"]').last();
        await csvInput.setInputFiles({
            name: 'inventario-qa.csv',
            mimeType: 'text/csv',
            buffer: Buffer.from('Producto;Categoría;Unidad;Stock;Stock mínimo;Costo unitario\nLeche QA;Lácteos;l;4;2;1500\n', 'utf8')
        });
        await page.getByText(/1 productos procesados desde CSV/).waitFor({ state: 'visible' });

        await page.locator('.cge-sidebar nav button').filter({ hasText: 'Inventario' }).click();
        await page.locator('.cge-table tbody tr').filter({ hasText: 'Leche QA' }).waitFor({ state: 'visible' });

        await page.locator('.cge-sidebar nav button').filter({ hasText: 'Respaldo' }).click();
        const backupInput = page.locator('input[type="file"][accept*="json"]');
        const invalidBackupDialogPromise = page.waitForEvent('dialog');
        await backupInput.setInputFiles({
            name: 'respaldo-invalido.json',
            mimeType: 'application/json',
            buffer: Buffer.from(JSON.stringify({ version: 1, products: [] }), 'utf8')
        });
        const invalidBackupDialog = await invalidBackupDialogPromise;
        assert.match(invalidBackupDialog.message(), /No pude leer este respaldo/);
        await invalidBackupDialog.accept();
        const stateAfterInvalidBackup = JSON.parse(await page.evaluate(() => localStorage.getItem('joinhook.cge.state.v1')));
        assert.equal(stateAfterInvalidBackup.products.some((item) => item.name === 'Leche QA'), true, 'Un respaldo inválido no debe reemplazar el estado actual');

        await backupInput.setInputFiles(backupPath);
        await page.getByText(/Respaldo restaurado correctamente/).waitFor({ state: 'visible' });

        await page.locator('.cge-sidebar nav button').filter({ hasText: 'Inventario' }).click();
        await page.locator('.cge-table tbody tr').filter({ hasText: 'Harina QA' }).waitFor({ state: 'visible' });
        assert.equal(await page.locator('.cge-table tbody tr').filter({ hasText: 'Leche QA' }).count(), 0);

        await page.locator('.cge-sidebar nav button').filter({ hasText: 'Respaldo' }).click();
        const [csvDownload] = await Promise.all([
            page.waitForEvent('download'),
            page.getByRole('button', { name: /Exportar inventario/ }).click()
        ]);
        assert.match(csvDownload.suggestedFilename(), /^inventario-\d{4}-\d{2}-\d{2}\.csv$/);
        const csvPath = await csvDownload.path();
        assert.ok(csvPath, 'La exportación CSV no generó archivo descargable');
        const exportedCsv = fs.readFileSync(csvPath, 'utf8');
        assert.match(exportedCsv, /Harina QA/);
        assert.doesNotMatch(exportedCsv, /Leche QA/);

        await page.reload({ waitUntil: 'networkidle' });
        await page.getByText('Cafetería QA JoinHook', { exact: true }).first().waitFor({ state: 'visible' });
        const persisted = JSON.parse(await page.evaluate(() => localStorage.getItem('joinhook.cge.state.v1')));
        assert.equal(persisted.businessName, 'Cafetería QA JoinHook');
        assert.equal(persisted.products.find((item) => item.name === 'Harina QA')?.stock, 12);
        assert.equal(persisted.products.some((item) => item.name === 'Leche QA'), false);

        await page.screenshot({ path: path.join(artifactsDir, 'cge-desktop.png'), fullPage: true });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(artifactsDir, 'home-mobile.png'), fullPage: true });
        await page.goto(`${baseUrl}/app/control-gastronomico-express/`, { waitUntil: 'networkidle' });
        await page.getByText('Cafetería QA JoinHook', { exact: true }).first().waitFor({ state: 'visible' });
        await page.screenshot({ path: path.join(artifactsDir, 'cge-mobile.png'), fullPage: true });

        const relevantErrors = browserErrors.filter((message) => /content security policy|refused to|uncaught|typeerror|referenceerror/i.test(message));
        assert.deepEqual(relevantErrors, [], `Errores de navegador relevantes:\n${relevantErrors.join('\n')}`);

        console.log('Browser QA PASS: onboarding, modal keyboard accessibility, supplier, product, purchase, waste, adjustment, CSV import/export, invalid/valid JSON backup handling, persistence, desktop/mobile.');
    } catch (error) {
        try {
            await page.screenshot({ path: path.join(artifactsDir, 'failure.png'), fullPage: true });
        } catch {}
        console.error(error);
        process.exitCode = 1;
    } finally {
        await browser.close();
    }
})();
