/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

'use strict';

$(document).ready(function() {

  // jQuery variables attached to DOM elements
  var $error = $('.error'),
    $errorMsg = $('.errorMsg'),
    $loading = $('.loading'),
    $results = $('.results'),
    $classification = $('.classification'),
    $confidence = $('.confidence'),
    $question = $('.questionText'),
    $script_input = $('.scriptInput');


  $('.ask-btn').click(function() {
    askQuestion($question.val());
    $question.focus();
  });

  $('.questionText').keyup(function(event){
    if(event.keyCode === 13) {
      askQuestion($question.val());
    }
  });

  // Ask a question via POST to /
  var askQuestion = function(question) {
    if ($.trim(question) === '')
      return;

    $question.val(question);

    $loading.show();
    $error.hide();
    $results.hide();

    $.post('/', {text: question})
      .done(function onSucess(answers){
        $results.show();
        $classification.text(answers.top_class);
        $confidence.text(Math.floor(answers.classes[0].confidence * 100) + '%');
        $script_input.text(question);
        $('html, body').animate({ scrollTop: $(document).height() }, 'fast');
      })
      .fail(function onError(error) {
        $error.show();
        $errorMsg.text(error.responseJSON.error ||
         'There was a problem with the request, please try again');
      })
      .always(function always(){
        $loading.hide();
      });
  };

  var script_num = 1;
  [
    "My question for the government is very simple. We know that housing solves problems. We know that housing pays for itself through the social investment. We know that housing is an integral part of building strong cities, strong neighbourhoods, but most important, strong families. In light of the fact we are facing an unprecedented crisis in Toronto, with 92,000 families, close to 200,000 people waiting for assisted housing, close to 5,000 people a year living in city shelters of whom half are children, with this calamity facing Canadians living in Toronto, with a calamity that is replicated unfortunately right across the country in every major city, every minor city, every medium city and every city of every description, why is the government satisfied with the status quo when it is literally putting people in harm's way?",
    "The provinces and territories can also invest in renovation projects. For example, they can provide rent supplements, shelter allowances and assistance toward home ownership. There are often other ways our government has invested in new housing. Economic action plan 2013 also extended the homelessness partnering strategy with nearly $600 million in funding over five years. Our new evidence-based housing first approach aims to stabilize the lives of homeless individuals for the long term by first moving them into permanent housing and then providing additional supports that they may need. I would also remind hon. members that we have made significant investments in new housing during the stimulus phase of Canada's economic action plan, including $400 million to build new affordable housing for low-income seniors, $75 million"
  ].forEach(function(question){
    $('<a>').text('script'+script_num)
      .mousedown(function() {
        askQuestion(question);
        return false;
      })
      .appendTo('.example-questions');
      script_num++;
  });


});
