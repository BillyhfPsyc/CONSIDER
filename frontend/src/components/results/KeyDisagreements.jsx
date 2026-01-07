import React from 'react';

const disagreements = [
  {
    topic: "When life begins",
    user: "Life begins later in pregnancy or after birth.",
    ai: "Life begins at conception and has moral status from that moment.",
  },
  {
    topic: "Exceptions to abortion",
    user: "Abortion is justified in cases of rape, incest, or harm to the mother.",
    ai: "Taking a life is wrong regardless of how it was conceived.",
  },
  {
    topic: "Whose rights matter most",
    user: "The pregnant person’s rights and autonomy should come first.",
    ai: "The unborn have a right to life that must be protected.",
  },
];

const KeyDisagreements = () => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 mb-10 shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center underline">
        Key Points of Disagreement
      </h2>

      <div className="space-y-6">
        {disagreements.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-bold text-lg mb-2">{item.topic}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-blue-700">User's view:</p>
                <p className="text-gray-800">{item.user}</p>
              </div>
              <div>
                <p className="font-medium text-green-700">AI's view:</p>
                <p className="text-gray-800">{item.ai}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyDisagreements;
