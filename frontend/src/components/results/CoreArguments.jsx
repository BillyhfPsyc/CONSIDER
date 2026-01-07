import React from 'react';

const CoreArguments = () => {
  return (
    <div className="core-arguments">
      <h2>Core Arguments and Beliefs</h2>
      <div className="arguments-columns">
        <div className="column user-column">
          <h3>User</h3>
          <p><strong>Bodily autonomy is fundamental:</strong> No one should be forced to carry a pregnancy against their will.</p>
          <p><strong>Personhood begins after birth or later in pregnancy:</strong> A fertilized egg or early fetus doesn’t have the same moral status as a person.</p>
          <p><strong>Every case is unique:</strong> Circumstances like rape, incest, fetal abnormalities, or financial hardship matter deeply.</p>
        </div>
        <div className="column ai-column">
          <h3>AI</h3>
          <p><strong>Life begins at conception:</strong> From the moment of fertilization, the fetus is a human life with rights.</p>
          <p><strong>Society should protect the vulnerable:</strong> The unborn are among the most voiceless and vulnerable members of society.</p>
          <p><strong>Human value isn’t dependent on circumstances:</strong> Being poor, young, or unwanted shouldn’t justify ending a life.</p>
        </div>
      </div>
    </div>
  );
};

export default CoreArguments;
