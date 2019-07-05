function save_options() {
  const pairs =
    Array.from(document.body.querySelectorAll('.mapping'), div =>
      Array.from(div.querySelectorAll('input'), input => input.value))
    .filter(pair => pair[0]);

  chrome.storage.local.set({ mappings: pairs });
}

function restore_options() {
  chrome.storage.local.get({ mappings: [] }, ({ mappings }) => {
    for (let [k, v] of mappings)
      add_mapping(k, v);
  });
}

function add_mapping(k, v) {
  const mappings = document.getElementById('mappings')
  const mapping = document.createElement('div');
  mapping.className = 'mapping';
  const key = document.createElement('input');
  key.value = k;
  const value = document.createElement('input');
  value.value = v;
  mapping.appendChild(key);
  mapping.appendChild(value);
  mappings.appendChild(mapping);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('add').addEventListener('click', () => add_mapping('', ''));
