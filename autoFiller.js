// ==UserScript==
// @name         PKU Visitor Helper - 自动填写访客申请
// @match        https://simso.pku.edu.cn/pages/sadEpiVisitorAppt.html
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length > 0) {
              const form = mutation.addedNodes[0];
              if (form.tagName === 'FORM') {
                  autoFillForm(form);
              }
          }
      });
  });

  const config = {
      childList: true,
      subtree: true
  };

  observer.observe(document.body, config);

  const dateArray = ['第一天', '第二天', '第三天'];
  const timeArray = [];
  for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
          timeArray.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
  }
  timeArray.pop();
  const gateArray = ['西南门', '东侧门', '东南门', '小东门', '南门', '万柳', '畅春新园'];

  function createFloatingForm() {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      overlay.style.zIndex = '1999';
      document.body.appendChild(overlay);
      // 创建悬浮界面
      const container = document.createElement('div');
      container.className = 'el-dialog__wrapper';
      container.innerHTML = `
        <div class="el-dialog">
          <style type="text/css">
              .delete-archive{
                  color: #94070a;
                  text-decoration: underline;
              }
          </style>
          <div class="el-dialog__header">
            <span class="el-dialog__title">PKU Visitor Helper</span>
            <button type="button" class="el-dialog__headerbtn">
              <i class="el-dialog__close el-icon el-icon-close"></i>
            </button>
          </div>
          <div class="el-dialog__body">
            <div class="archive-section">
              <label class="el-form-item__label">档案</label>
              <div class="el-select">
                <div class="el-input el-input--suffix">
                  <input type="text" readonly="readonly" autocomplete="off" placeholder="请选择档案" class="el-input__inner">
                  <span class="el-input__suffix">
                    <span class="el-input__suffix-inner">
                      <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                    </span>
                  </span>
                </div>
                <div class="el-select-dropdown el-popper" style="display: none;">
                  <div class="el-scrollbar">
                    <div class="el-select-dropdown__wrap ">
                      <ul class="el-scrollbar__view el-select-dropdown__list"></ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="el-switch">
                <input type="checkbox" name="" class="el-switch__input" autocomplete="off">
                <span class="el-switch__core" style="width: 40px;"></span>
                <span class="el-switch__label el-switch__label--right">
                  <span class="el-switch__label-text">自动填充</span>
                </span>
              </div>
            </div>
            <div class="el-divider el-divider--horizontal">
              <div class="el-divider__text is-left">Edit Archive</div>
            </div>
            <div class="new-archive-section">
              <form class="el-form">
                <div class="el-form-item">
                  <label class="el-form-item__label">预约人联系电话序号</label>
                  <div class="el-form-item__content">
                    <div class="el-input">
                      <input type="text" autocomplete="off" placeholder="请输入预约人联系电话序号" class="el-input__inner">
                    </div>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">预约入校日期</label>
                  <div class="el-form-item__content">
                    <div class="el-select">
                      <div class="el-input el-input--suffix">
                        <input type="text" readonly="readonly" autocomplete="off" placeholder="请选择预约入校日期" class="el-input__inner">
                        <span class="el-input__suffix">
                          <span class="el-input__suffix-inner">
                            <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                          </span>
                        </span>
                      </div>
                      <div class="el-select-dropdown el-popper" style="display: none;">
                        <div class="el-scrollbar">
                          <div class="el-select-dropdown__wrap ">
                            <ul class="el-scrollbar__view el-select-dropdown__list">
                              <li class="el-select-dropdown__item">第一天</li>
                              <li class="el-select-dropdown__item">第二天</li>
                              <li class="el-select-dropdown__item">第三天</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">预约入校时间</label>
                  <div class="el-form-item__content">
                    <div class="el-select">
                      <div class="el-input el-input--suffix">
                        <input type="text" readonly="readonly" autocomplete="off" placeholder="请选择预约入校时间" class="el-input__inner">
                        <span class="el-input__suffix">
                          <span class="el-input__suffix-inner">
                            <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                          </span>
                        </span>
                      </div>
                      <div class="el-select-dropdown el-popper" style="display: none;">
                        <div class="el-scrollbar">
                          <div class="el-select-dropdown__wrap el-scrollbar__wrap">
                            <ul class="el-scrollbar__view el-select-dropdown__list"></ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">预约入校校门</label>
                  <div class="el-form-item__content">
                    <div class="el-select">
                      <div class="el-input el-input--suffix">
                        <input type="text" readonly="readonly" autocomplete="off" placeholder="请选择预约入校校门" class="el-input__inner">
                        <span class="el-input__suffix">
                          <span class="el-input__suffix-inner">
                            <i class="el-select__caret el-input__icon el-icon-arrow-up"></i>
                          </span>
                        </span>
                      </div>
                      <div class="el-select-dropdown el-popper" style="display: none;">
                        <div class="el-scrollbar">
                          <div class="el-select-dropdown__wrap ">
                            <ul class="el-scrollbar__view el-select-dropdown__list">
                              <li class="el-select-dropdown__item">西南门</li>
                              <li class="el-select-dropdown__item">东侧门</li>
                              <li class="el-select-dropdown__item">东南门</li>
                              <li class="el-select-dropdown__item">小东门</li>
                              <li class="el-select-dropdown__item">南门</li>
                              <li class="el-select-dropdown__item">万柳</li>
                              <li class="el-select-dropdown__item">畅春新园</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">被预约人姓名</label>
                  <div class="el-form-item__content">
                    <div class="el-input">
                      <input type="text" autocomplete="off" placeholder="请输入被预约人姓名" class="el-input__inner">
                    </div>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">被预约人证件号</label>
                  <div class="el-form-item__content">
                    <div class="el-input">
                      <input type="text" autocomplete="off" placeholder="请输入被预约人证件号" class="el-input__inner">
                    </div>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">被预约人联系电话</label>
                  <div class="el-form-item__content">
                    <div class="el-input">
                      <input type="text" autocomplete="off" placeholder="请输入被预约人联系电话" class="el-input__inner">
                    </div>
                  </div>
                </div>
                <div class="el-form-item">
                  <label class="el-form-item__label">预约事由</label>
                  <div class="el-form-item__content">
                    <div class="el-input">
                      <input type="text" autocomplete="off" placeholder="请输入预约事由" class="el-input__inner">
                    </div>
                  </div>
                </div>
                <div class="el-form-item">
                  <div class="el-form-item__content">
                    <button type="button" class="el-button el-button--primary">
                      <span>保存档案</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);
      container.style.zIndex = '2000';
      const dateSelect = container.querySelector('input[placeholder="请选择预约入校日期"]').parentNode.parentNode;
      const timeSelect = container.querySelector('input[placeholder="请选择预约入校时间"]').parentNode.parentNode;
      const gateSelect = container.querySelector('input[placeholder="请选择预约入校校门"]').parentNode.parentNode;
      const timeOptions = [];
      for (let hour = 8; hour <= 20; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
              timeOptions.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
          }
      }
      timeOptions.pop();
      timeSelect.querySelector('.el-select-dropdown__list').innerHTML = timeOptions.map(time => `<li class="el-select-dropdown__item">${time}</li>`).join('');


      // 初始化变量
      const archiveSelect = container.querySelector('.archive-section .el-select');
      const archiveList = archiveSelect.querySelector('.el-select-dropdown__list');
      const autoFillSwitch = container.querySelector('.archive-section .el-switch');
      const form = container.querySelector('.new-archive-section form');
      const saveButton = form.querySelector('button[type="button"]');
      const closeButton = container.querySelector('.el-dialog__headerbtn');
      let archives = JSON.parse(localStorage.getItem('archives')) || [];

      // 渲染档案列表
      function renderArchiveList() {
          archiveList.innerHTML = archives.map((archive, index) => `
          <li class="el-select-dropdown__item">${archive.name} - ${archive.phone} <span data-index="${index}" class="delete-archive">删除</span></li>
        `).join('') + '<li class="el-select-dropdown__item">新档案</li>';
      }

      // 保存档案
      function saveArchive() {
          const name = form.querySelector('input[placeholder="请输入被预约人姓名"]').value;
          const phone = form.querySelector('input[placeholder="请输入被预约人联系电话"]').value;
          const data = {
              phoneIndex: form.querySelector('input[placeholder="请输入预约人联系电话序号"]').value,
              date: form.querySelector('input[placeholder="请选择预约入校日期"]').value,
              time: form.querySelector('input[placeholder="请选择预约入校时间"]').value,
              gate: form.querySelector('input[placeholder="请选择预约入校校门"]').value,
              name: name,
              idNumber: form.querySelector('input[placeholder="请输入被预约人证件号"]').value,
              phone: phone,
              reason: form.querySelector('input[placeholder="请输入预约事由"]').value
          };
          const selectedIndex = archiveSelect.dataset.selectedIndex;
          if (selectedIndex !== undefined) {
              archives[selectedIndex] = data;
          } else {
              archives.push(data);
          }
          localStorage.setItem('archives', JSON.stringify(archives));
          localStorage.setItem('selectedIndex', archives.length - 1);
          archiveSelect.querySelector('input').value = name + ' - ' + phone;
          autoFillSwitch.classList.remove('is-disabled');
          renderArchiveList();
      }

      // 删除档案
      function deleteArchive(index) {
          archives.splice(index, 1);
          localStorage.setItem('archives', JSON.stringify(archives));
          renderArchiveList();
      }

      // 填充表单
      function fillForm(archive) {
          form.querySelector('input[placeholder="请输入预约人联系电话序号"]').value = archive.phoneIndex;
          form.querySelector('input[placeholder="请选择预约入校日期"]').value = archive.date;
          form.querySelector('input[placeholder="请选择预约入校时间"]').value = archive.time;
          form.querySelector('input[placeholder="请选择预约入校校门"]').value = archive.gate;
          form.querySelector('input[placeholder="请输入被预约人姓名"]').value = archive.name;
          form.querySelector('input[placeholder="请输入被预约人证件号"]').value = archive.idNumber;
          form.querySelector('input[placeholder="请输入被预约人联系电话"]').value = archive.phone;
          form.querySelector('input[placeholder="请输入预约事由"]').value = archive.reason;
      }

      // 清空表单
      function clearForm() {
          form.reset();
          archiveSelect.dataset.selectedIndex = undefined;
      }

      // 初始化事件监听器
      archiveSelect.addEventListener('click', () => {
          archiveSelect.querySelector('.el-select-dropdown').style.display = 'block';
      });

      archiveList.addEventListener('mousedown', (event) => {
          event.stopPropagation();
          if (event.target.classList.contains('delete-archive')) {
              const index = event.target.dataset.index;
              deleteArchive(index);
              clearForm();
              if (autoFillSwitch.classList.contains('is-checked')) {
                  autoFillSwitch.click()
              }
              autoFillSwitch.classList.add('is-disabled');
              archiveSelect.querySelector('input').value = '新档案';
          } else {
              const selectedIndex = Array.from(archiveList.children).indexOf(event.target);
              localStorage.setItem('selectedIndex', selectedIndex);
              if (selectedIndex === archives.length) {
                  clearForm();
                  if (autoFillSwitch.classList.contains('is-checked')) {
                      autoFillSwitch.click()
                  }
                  autoFillSwitch.classList.add('is-disabled');
                  archiveSelect.querySelector('input').value = '新档案';
              } else {
                  fillForm(archives[selectedIndex]);
                  archiveSelect.dataset.selectedIndex = selectedIndex;
                  archiveSelect.querySelector('input').value = archives[selectedIndex].name + ' - ' + archives[selectedIndex].phone;
              }
              archiveSelect.querySelector('.el-select-dropdown').style.display = 'none';
          }
      });

      archiveSelect.querySelector('input').addEventListener('blur', () => {
          archiveSelect.querySelector('.el-select-dropdown').style.display = 'none';
      });

      autoFillSwitch.addEventListener('click', () => {
          const checked = !autoFillSwitch.classList.contains('is-checked');
          localStorage.setItem('autoFill', checked);
          if (checked) {
              autoFillSwitch.classList.add('is-checked');
              const selectedIndex = archiveSelect.dataset.selectedIndex;
              if (selectedIndex !== undefined) {
                  fillForm(archives[selectedIndex]);
              }
          } else {
              autoFillSwitch.classList.remove('is-checked');
          }
      });

      saveButton.addEventListener('click', saveArchive);

      closeButton.addEventListener('click', () => {
          overlay.remove();
          container.remove();
          setTimeout(() => {
              fillAction(document.querySelector('form'));
          }, 500);
      });

      dateSelect.addEventListener('click', () => {
          dateSelect.querySelector('.el-select-dropdown').style.display = 'block';
      });

      timeSelect.addEventListener('click', () => {
          timeSelect.querySelector('.el-select-dropdown').style.display = 'block';
      });

      gateSelect.addEventListener('click', () => {
          gateSelect.querySelector('.el-select-dropdown').style.display = 'block';
      });
      dateSelect.querySelector('.el-select-dropdown__list').addEventListener('mousedown', (event) => {
          event.stopPropagation();
          dateSelect.querySelector('input').value = event.target.textContent;
          dateSelect.querySelector('.el-select-dropdown').style.display = 'none';
      });

      timeSelect.querySelector('.el-select-dropdown__list').addEventListener('mousedown', (event) => {
          event.stopPropagation();
          timeSelect.querySelector('input').value = event.target.textContent;
          timeSelect.querySelector('.el-select-dropdown').style.display = 'none';
      });

      gateSelect.querySelector('.el-select-dropdown__list').addEventListener('mousedown', (event) => {
          event.stopPropagation();
          gateSelect.querySelector('input').value = event.target.textContent;
          gateSelect.querySelector('.el-select-dropdown').style.display = 'none';
      });

      dateSelect.querySelector('.el-select-dropdown').addEventListener('click', (event) => {
          event.preventDefault(); // 阻止默认行为
      });

      timeSelect.querySelector('.el-select-dropdown').addEventListener('click', (event) => {
          event.preventDefault(); // 阻止默认行为
      });

      gateSelect.querySelector('.el-select-dropdown').addEventListener('click', (event) => {
          event.preventDefault(); // 阻止默认行为
      });

      dateSelect.querySelector('input').addEventListener('blur', () => {
          dateSelect.querySelector('.el-select-dropdown').style.display = 'none';
      });

      timeSelect.querySelector('input').addEventListener('blur', () => {
          timeSelect.querySelector('.el-select-dropdown').style.display = 'none';
      });

      gateSelect.querySelector('input').addEventListener('blur', () => {
          gateSelect.querySelector('.el-select-dropdown').style.display = 'none';
      });

      // 初始化表单和开关状态
      if (archives.length === 0) {
          autoFillSwitch.classList.add('is-disabled');
          archiveSelect.querySelector('input').value = '新档案';
      } else {
          const autoFill = localStorage.getItem('autoFill') === 'true';
          if (autoFill) {
              autoFillSwitch.classList.add('is-checked');
              const selectedIndex = archives.length - 1;
              if (selectedIndex !== null) {
                  fillForm(archives[selectedIndex]);
                  archiveSelect.dataset.selectedIndex = localStorage.getItem('selectedIndex');
                  archiveSelect.querySelector('input').value = archives[selectedIndex].name + ' - ' + archives[selectedIndex].phone;
              }
          } else {
              const lastIndex = archives.length - 1;
              fillForm(archives[lastIndex]);
              archiveSelect.dataset.selectedIndex = lastIndex;
              archiveSelect.querySelector('input').value = archives[lastIndex].name + ' - ' + archives[lastIndex].phone;
          }
      }

      renderArchiveList();
  }

  // 获取自动填充状态和选择的档案
  window.getAutoFillAndSelectedArchive = function() {
      return {
          autoFill: localStorage.getItem('autoFill') === 'true',
          selectedArchive: JSON.parse(localStorage.getItem('archives'))[localStorage.getItem('selectedIndex')]
      };
  }

  function fillAction(form) {
      const {
          autoFill,
          selectedArchive
      } = window.getAutoFillAndSelectedArchive();
      if (autoFill) {
          form.querySelector('input[placeholder="请输入被预约人姓名"]').value = selectedArchive.name;
          form.querySelector('input[placeholder="请输入被预约人证件号"]').value = selectedArchive.idNumber;
          form.querySelector('input[placeholder="请输入被预约人联系电话，11位手机号"]').value = selectedArchive.phone;
          form.querySelector('textarea').value = selectedArchive.reason;
          let dateSelector = document.querySelectorAll(".el-select-dropdown.el-popper")[0];
          let gateSelector = document.querySelectorAll(".el-select-dropdown.el-popper")[1];
          let timeSelector = document.querySelector(".el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--time-select");
          dateSelector.querySelectorAll(".el-select-dropdown__item")[dateArray.indexOf(selectedArchive.date)].click();
          gateSelector.querySelectorAll(".el-select-dropdown__item")[gateArray.indexOf(selectedArchive.gate)].click();
          timeSelector.__vue__.handleFocus();
          setTimeout(() => {
              document.querySelector(".el-picker-panel__content").querySelectorAll(".time-select-item")[timeArray.indexOf(selectedArchive.time)].click();
          }, 500);
          let inputEvent = new Event('input', {
              bubbles: true,
              cancelable: true
          });
          let changeEvent = new Event('change');
          form.querySelector('input[placeholder="请输入被预约人姓名"]').dispatchEvent(inputEvent);
          form.querySelector('input[placeholder="请输入被预约人证件号"]').dispatchEvent(inputEvent);
          form.querySelector('input[placeholder="请输入被预约人联系电话，11位手机号"]').dispatchEvent(inputEvent);
          form.querySelector('textarea').dispatchEvent(inputEvent);
          document.querySelector(".el-button.el-button--primary.el-button--small.is-plain").click();
          setTimeout(() => {
              document.querySelectorAll(".contactItemMsg")[parseInt(selectedArchive.phoneIndex) - 1].click();
          }, 500);
      }
  }

  function autoFillForm(form) {
      let button_tag = document.createElement('div');
      button_tag.innerHTML = '<i class="el-icon-setting"></i><span>自动填充设置</span>';
      button_tag.className = 'el-button el-button--primary el-button--small is-plain';
      button_tag.onclick = createFloatingForm;
      form.childNodes[3].appendChild(button_tag);
      setTimeout(function() {
          console.log('filling');
          fillAction(form);
      }, 500);
  }
})();
