import React from 'react';
import { useApp } from '../../context/AppContext';
import { currencySymbols } from '../../utils/currencyRates';

const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, dispatch } = useApp();
  const settings = state.settings;

  const isDark = settings.theme === 'dark';

  const handleChange = (key: string, value: any) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [key]: value },
    });
  };

  const toggleTheme = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { theme: isDark ? 'light' : 'dark' },
    });
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        currency: newCurrency,
        currencySymbol: currencySymbols[newCurrency] || '$',
      },
    });
  };

  const saveSettings = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div
        className={`rounded-lg shadow-xl w-full max-w-md mx-4 p-6 transition-all duration-200
          ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-white">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Theme</label>
            <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded text-sm font-medium border
                ${isDark
                  ? 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700'
                  : 'bg-white text-black border-zinc-300 hover:bg-zinc-100'}`}
            >
              {isDark ? 'Dark' : 'Light'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Decimal Precision</label>
            <select
              value={settings.decimalPrecision}
              onChange={(e) => handleChange('decimalPrecision', parseInt(e.target.value))}
              className={`w-full p-2 border rounded ${isDark ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}
            >
              {[0, 1, 2, 3, 4].map((val) => (
                <option key={val} value={val}>{val} </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
              value={settings.currency}
              onChange={handleCurrencyChange}
              className={`w-full p-2 border rounded ${isDark ? 'bg-zinc-800 text-white' : 'bg-white text-black'}`}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
              <option value="KRW">KRW (₩)</option>
              <option value="RUB">RUB (₽)</option>
              <option value="TRY">TRY (₺)</option>
              <option value="VND">VND (₫)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Font Size</label>
            <input
              type="range"
              min={12}
              max={20}
              value={settings.fontSize}
              onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>20px</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Auto-save</label>
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleChange('autoSave', e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Line Numbers</label>
            <input
              type="checkbox"
              checked={settings.showLineNumbers}
              onChange={(e) => handleChange('showLineNumbers', e.target.checked)}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={saveSettings}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;