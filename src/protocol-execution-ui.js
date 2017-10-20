const yo = require('yo-yo');

class ProtocolExecutionUI extends UIPlugin {
  /* Example step-wize execution plugin using asynchronous calls */
  constructor(element, focusTracker) {
    super(element, focusTracker, "ProtocolExecutionUI");
    this.maxWaitTime = 10000;
    this.render();
  }
  listen() {
    this.bindSignalMsg("register-plugins", "register");
  }
  async play() {
    const microdrop = new MicrodropAsync();
    const steps = await microdrop.steps.steps();
    let stepNumber = await microdrop.steps.currentStepNumber();

    const stepComplete = () => {
      /* Promise that resolves when 'step-complete' is triggered */
      return new Promise((resolve, reject) => {
        this.on('step-complete', () => {
          resolve();
        });
      });
    }

    const onStepComplete = () => {
      /* Handler passed to executer that triggers event 'step-complete' */
      this.trigger('step-complete', null);
    };

    while (stepNumber < steps.length) {
      /* Iterate through each step awaiting for stepComplete() callback */
      this.render("running", stepNumber);
      const step = steps[stepNumber];
      const electrodes = step.electrodes;
      const channels = step.channels;
      await microdrop.steps.putStepNumber(stepNumber);
      await microdrop.routes.execute(step, onStepComplete);
      await stepComplete();
      stepNumber += 1;
    }
    this.render("complete");
  }

  render(status="stopped", stepNumber='') {
    let badge;
    if (status == "running")  badge = "warning";
    if (status == "stopped")  badge = "default";
    if (status == "complete") badge = "success";
    if (status == "error")    badge = "danger";

    const node = yo`
      <div>
        <div class="btn-group">
          <button type="button" onclick=${this.play.bind(this)}
            class="btn btn-sm btn-secondary">Play
            </button>
          <button type="button" class="btn btn-sm btn-secondary disabled">Pause</button>
        </div>
        <span class="badge badge-${badge}">${status} ${stepNumber}</span>
      </div>
    `;
    this.element.innerHTML = "";
    this.element.appendChild(node);
  }
}

module.exports = ProtocolExecutionUI;
