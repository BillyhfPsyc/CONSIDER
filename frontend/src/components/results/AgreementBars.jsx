import React from 'react';

const agreementData = [
  {
    statement: "Abortion should be legal in all cases.",
    userScore: 82,
    aiScore: 35,
  },
  {
    statement: "The fetus has moral status from conception.",
    userScore: 22,
    aiScore: 90,
  },
  {
    statement: "Each situation should be judged contextually, not universally.",
    userScore: 88,
    aiScore: 74,
  },
];

const AgreementBars = () => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 mb-16 shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center underline">
        Agreement with Key Statements
      </h2>

      <div className="space-y-6">
        {agreementData.map(({ statement, userScore, aiScore }, index) => (
          <div key={index} className="mb-6">
            <p className="font-medium mb-2">{statement}</p>

            {/* User bar */}
            <div className="flex items-center mb-1">
              <span className="w-20 text-sm text-gray-600">User</span>
              <div className="relative w-full h-5 bg-gray-200 rounded">
                <div
                  className="absolute top-0 left-0 h-5 bg-blue-500 rounded"
                  style={{ width: `${userScore}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-700">{userScore}%</span>
            </div>

            {/* AI bar */}
            <div className="flex items-center">
              <span className="w-20 text-sm text-gray-600">AI</span>
              <div className="relative w-full h-5 bg-gray-200 rounded">
                <div
                  className="absolute top-0 left-0 h-5 bg-green-500 rounded"
                  style={{ width: `${aiScore}%` }}
                />
              </div>
              <span className="ml-2 text-sm text-gray-700">{aiScore}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgreementBars;
