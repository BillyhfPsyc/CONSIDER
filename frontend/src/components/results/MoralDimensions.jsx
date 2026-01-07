import React from 'react';

const moralData = [
  { dimension: 'Care/Harm', userScore: 80, aiScore: 70 },
  { dimension: 'Fairness/Cheating', userScore: 75, aiScore: 65 },
  { dimension: 'Loyalty/Betrayal', userScore: 40, aiScore: 85 },
  { dimension: 'Authority/Subversion', userScore: 35, aiScore: 90 },
  { dimension: 'Sanctity/Degradation', userScore: 30, aiScore: 88 },
  { dimension: 'Liberty/Oppression', userScore: 92, aiScore: 60 },
  { dimension: 'Purity/Contamination', userScore: 25, aiScore: 80 },
];

const MoralDimensions = () => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 mb-10 shadow-sm bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-center underline">
        Moral Dimensions: Importance Ratings
      </h2>

      <div className="space-y-6">
        {moralData.map(({ dimension, userScore, aiScore }) => (
          <div key={dimension}>
            <h3 className="text-lg font-semibold mb-1">{dimension}</h3>

            {/* USER bar */}
            <div className="flex items-center mb-1">
              <span className="w-24 text-sm font-medium text-gray-600">User</span>
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
              <span className="w-24 text-sm font-medium text-gray-600">AI</span>
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

export default MoralDimensions;
