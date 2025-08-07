import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RVDSelect.css';

const RVDs = [
  {
    label: "Immigration",
    description: "Should borders be open? What should immigration laws allow? Who should be allowed into which countries?",
    tag: "Human Rights"
  },
  {
    label: "Veganism",
    description: "Should we eat animal products?",
    tag: "Environment"
  },
  {
    label: "Having Children",
    description: "Should people be allowed to have as many children as they please?",
    tag: "Environment"
  },
  {
    label: "Environment-Economy trade-offs",
    description: "Should environmental concerns trump economic concerns? Or vice-versa?",
    tag: "Environment"
  },
  {
    label: "War",
    description: "Are wars ever justified, given their effect on civilians? When?",
    tag: "Human Rights"
  },
  {
    label: "Euthanasia",
    description: "Should people be free to choose to die?",
    tag: "Human Rights"
  },
  {
    label: "Transgender Issues",
    description: "Should there be trans bathrooms? Is it a mental illness? Should trans youth have access to gender-affirming surgeries?",
    tag: "Human Rights"
  },
  {
    label: "Misgendering",
    description: "Should misgendering be criminal?",
    tag: "Human Rights"
  }
];

function RVDSelect() {
  const navigate = useNavigate();

  const handleClick = (rvd) => {
    navigate('/current-position', { state: { topic: rvd } }); // 'rvd' defined as a single object from RVDs.
  };

  return (
    <div className="rvd-page">
      <div className="rvd-heading">
        <h1 className="rvd-title">Choose your topic</h1>
        <p className="rvd-subtitle">Hover over a topic to get more information</p>
      </div>

      <div className="rvd-container">
        {RVDs.map((rvd, index) => (
          <div key={index} className="rvd-button-wrapper">
            <button
              className="rvd-button"
              onClick={() => handleClick(rvd)}
            >
              {rvd.label}
              <span className="rvd-hover-description">{rvd.description}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RVDSelect;
