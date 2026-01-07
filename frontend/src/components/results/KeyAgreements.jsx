import React from 'react';

const agreements = [
  {
    theme: "Value of human life",
    agreement: "Both agree that human life has intrinsic moral worth and should not be treated lightly.",
  },
  {
    theme: "Emotional toll of abortion",
    agreement: "Both acknowledge that abortion is a deeply emotional decision, often involving pain or conflict.",
  },
  {
    theme: "Need for thoughtful dialogue",
    agreement: "Both believe it is important to talk about these issues respectfully and seek common ground where possible.",
  },
];

const KeyAgreements = () => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 mb-10 shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center underline">
        Key Points of Agreement
      </h2>

      <div className="space-y-6">
        {agreements.map((item, index) => (
          <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-700 text-lg mb-1">{item.theme}</h3>
            <p className="text-gray-800">{item.agreement}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyAgreements;
